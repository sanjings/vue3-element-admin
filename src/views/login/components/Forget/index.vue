<script lang="ts" setup>
  import { requestPasswordSet, requestPasswordSendSms } from '@/services/api/user';
  import { type FormInstance, type FormRules } from 'element-plus';
  import { validatePassword, validatePhone } from '@/utils/validate';
  import { encodeByBase64 } from '@/utils/encryption';

  defineOptions({
    name: 'Forget'
  });

  const $emit = defineEmits(['back']);

  const submitLoading = ref(false);
  const codeCountdown = ref(0);
  const codeTimer = ref<TimeoutHandle | null>(null);
  const smsCodeLoading = ref(false);
  const formRef = useTemplateRef<FormInstance>('form');
  const formState = reactive({
    phone: '',
    smsCode: '',
    newPassword: ''
  });
  const formRules: FormRules = {
    phone: [{ validator: validatePhone, trigger: 'blur' }],
    smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    newPassword: [{ validator: validatePassword, trigger: 'blur' }]
  };

  /**
   *  发送验证码
   */
  const handleSendSmsCode = async () => {
    await formRef.value?.validateField('phone');
    smsCodeLoading.value = true;
    const res = await requestPasswordSendSms({ phone: formState.phone });
    smsCodeLoading.value = false;
    if (res.code === 200) {
      codeCountdown.value = 60;
      codeTimer.value = setInterval(() => {
        if (codeCountdown.value > 0) {
          codeCountdown.value -= 1;
        } else {
          clearInterval(codeTimer.value!);
        }
      }, 1000);
    } else {
      ElMessage.error(res.message);
    }
  };

  /**
   * 忘记密码提交
   */
  const handleSubmit = async () => {
    await formRef.value?.validate();
    try {
      submitLoading.value = true;
      const res = await requestPasswordSet({ ...formState, newPassword: encodeByBase64(formState.newPassword) });
      if (+res.code === 200) {
        ElMessage.success('设置成功');
        $emit('back');
      } else {
        ElMessage.error(res.message || '设置失败');
      }
    } finally {
      submitLoading.value = false;
    }
  };
</script>

<template>
  <el-form ref="form" :model="formState" :rules="formRules" class="forget-form">
    <h2 class="forget-form__title">重置密码</h2>
    <el-form-item prop="phone">
      <el-input v-model.trim="formState.phone" placeholder="请输入您的手机号" maxlength="11" prefix-icon="iphone" />
    </el-form-item>

    <el-form-item prop="smsCode">
      <div class="flex-row" style="width: 100%">
        <el-input v-model.trim="formState.smsCode" maxlength="6" placeholder="请输入验证码" prefix-icon="message" />
        <Button
          type="primary"
          size="large"
          style="flex: 1; height: 50px; font-size: 16px"
          :disabled="codeCountdown > 0"
          :loading="smsCodeLoading"
          @click="handleSendSmsCode()"
        >
          {{ codeCountdown > 0 ? `${codeCountdown}s后重新发送` : '发送验证码' }}
        </Button>
      </div>
    </el-form-item>
    <el-form-item prop="newPassword">
      <el-input
        type="newPassword"
        v-model.trim="formState.newPassword"
        show-password
        prefix-icon="lock"
        placeholder="请输入您的新密码"
        autocomplete="new-password"
      />
    </el-form-item>
    <div class="flex-sbt" style="padding-top: 20px">
      <Button size="large" block :debounce="0" class="back-btn" @click="$emit('back')">返 回</Button>
      <Button type="primary" size="large" block class="submit-btn" :loading="submitLoading" @click="handleSubmit()">
        提 交
      </Button>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
  .forget-form {
    &__title {
      padding-bottom: 30px;
      font-size: 24px;
      letter-spacing: 0.5px;
    }

    .el-form-item {
      margin-bottom: 20px;

      :deep(.el-input__wrapper) {
        padding-block: 10px;
        font-size: 18px;
        background-color: #f4f8fb;
        box-shadow: none;

        .el-input__prefix {
          margin-right: 10px;
          font-size: 20px;
          color: $color-blue;
        }
      }
    }

    .back-btn,
    .submit-btn {
      height: 48px;
      font-size: 18px;
      border-radius: 8px;
    }
  }
</style>
