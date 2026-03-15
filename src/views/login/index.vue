<script lang="ts" setup>
  import Forget from './components/Forget/index.vue';
  import { useUserStore } from '@/store/user';
  import { requestLogin } from '@/services/api/user';
  import { type FormInstance, type FormRules } from 'element-plus';
  import { validatePhone } from '@/utils/validate';
  import { encodeByBase64 } from '@/utils/encryption';

  defineOptions({
    name: '/login'
  });

  const { VITE_APP_TITLE } = import.meta.env;

  const $router = useRouter();
  const $route = useRoute();
  const userStore = useUserStore();
  const formType = ref('login');
  const submitLoading = ref(false);
  const formRef = useTemplateRef<FormInstance>('form');
  const formState = reactive({
    phone: '',
    password: ''
  });
  const formRules: FormRules = {
    phone: { required: true, validator: validatePhone, trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' }
  };

  /**
   * 登录提交
   */
  const handleLogin = async () => {
    await formRef.value?.validate();
    try {
      submitLoading.value = true;
      const res = await requestLogin({ ...formState, password: encodeByBase64(formState.password) });
      if (+res.code === 200) {
        userStore.setToken(res.data.token!);
        userStore.setUserInfo(res.data);
        setTimeout(() => {
          $router.replace($route.query?.redirect ? decodeURIComponent($route.query?.redirect as string) : '/');
        }, 50);
        ElMessage.success('登录成功');
      } else {
        ElMessage.error(res.message || '登录失败');
      }
    } finally {
      submitLoading.value = false;
    }
  };
</script>

<template>
  <div class="login-wrap">
    <div class="login-inner">
      <div class="app-title">
        <h1 class="app-title__main">{{ VITE_APP_TITLE }}</h1>
      </div>
      <div class="login-inner-form">
        <el-form v-show="formType === 'login'" ref="form" :model="formState" :rules="formRules" class="login-form">
          <h2 class="login-form__title">欢迎您登录系统</h2>
          <el-form-item prop="phone">
            <el-input
              v-model.trim="formState.phone"
              placeholder="请输入您的手机号"
              maxlength="11"
              prefix-icon="iphone"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model.trim="formState.password"
              show-password
              placeholder="请输入您的密码"
              prefix-icon="lock"
            />
          </el-form-item>
          <div class="flex-row-end" style="margin-bottom: 20px">
            <el-button link @click="formType = 'forget'">忘记密码</el-button>
          </div>
          <Button type="primary" size="large" block class="login-btn" :loading="submitLoading" @click="handleLogin()">
            登 录
          </Button>
        </el-form>
        <Forget v-show="formType === 'forget'" @back="formType = 'login'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .login-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f0f2f5;
    background-image: url('@/assets/images/login_bg.png');
    background-size: cover;

    .app-title {
      padding-bottom: 40px;
      text-align: center;
      letter-spacing: 0.5px;

      &__main {
        font-size: 40px;
        letter-spacing: 2px;
      }
    }

    .login-inner {
      .login-inner-form {
        width: 450px;
        padding: 50px 40px;
        background-color: #ffffff;
        border-radius: 10px;

        .login-form {
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

          .login-btn {
            height: 48px;
            font-size: 18px;
            border-radius: 8px;
          }
        }
      }
    }
  }
</style>
