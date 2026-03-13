<script lang="ts" setup>
  import {
    genFileId,
    type UploadProps,
    type UploadUserFile,
    type UploadInstance,
    type UploadRawFile
  } from 'element-plus';
  import { useUserStore } from '@/store/user';
  import { getFileNameSuffix } from '@/utils/index';
  import { cloneDeep } from 'lodash-es';
  import { FileType } from '@/contansts/typeEnum';
  import { imageViewer } from '@/utils/viewer';
  import type { ApiResponseData, UploadFileResponse, UploadSuccessFiles } from 'types/api';

  defineOptions({
    name: 'UploadFile'
  });

  const {
    listType = 'text',
    showFileList = true,
    baseUrl = import.meta.env.VITE_HTTP_BASE_URL,
    apiUrl = '/common/upload',
    name = 'file',
    drag = false,
    readonly = false,
    limit = 1,
    fileList = [],
    fileType,
    accept,
    maxSize = 20
  } = defineProps<{
    /**
     * 文件列表的类型
     * @default 'text'
     */
    listType?: 'text' | 'picture' | 'picture-card';
    /**
     * 是否显示已上传文件列表
     * @default true
     */
    showFileList?: boolean;
    /**
     * base URL
     * @default VITE_HTTP_BASE_URL
     */
    baseUrl?: string;
    /**
     * 请求 URL
     * @default '/common/upload'
     */
    apiUrl?: string;
    /**
     * 上传的文件字段名
     * @default 'file'
     */
    name?: string;
    /**  */
    /**
     * 是否启用拖拽上传
     * @default false
     */
    drag?: boolean;
    /**
     * 允许上传文件的最大数量
     * @default 1
     */
    limit?: number;
    /**
     * 是否禁用上传
     * @default false
     */
    readonly?: boolean;
    /** 默认上传文件 */
    fileList?: UploadUserFile[];
    /** 文件类型 */
    fileType: FileType;
    /**
     * 接受上传的文件类型
     */
    accept?: string;
    /**
     * 文件大小限制
     * @default 20
     */
    maxSize?: number;
  }>();

  const $emit = defineEmits(['change', 'update:fileList', 'beforeUplode']);
  const userStore = useUserStore();
  const uploadWrapperRef = useTemplateRef<HTMLElement>('uploadWrapper');
  const uploadRef = ref<UploadInstance>();
  const disabled = ref<boolean>(readonly);
  const showVideo = ref<boolean>(false);
  const curVideoUrl = ref<string>('');
  const multiple = computed<boolean>(() => !(limit === 1));
  const _fileList = computed<UploadUserFile[]>({
    get() {
      return fileList;
    },
    set(val) {
      $emit('update:fileList', val || []);
    }
  });

  const fileTypeText = computed(() => {
    switch (fileType) {
      case FileType.IMAGE:
        return '图片';
      case FileType.VIDEO:
        return '视频';
      case FileType.FILE:
        return '文件';
      default:
        return '文件';
    }
  });

  const hideUploadImage = () => {
    setTimeout(() => {
      const uploadBtnDom = uploadWrapperRef.value?.getElementsByClassName(
        'el-upload--picture-card'
      )?.[0] as HTMLElement;
      if (!uploadBtnDom) return;
      if (readonly) {
        uploadBtnDom.style.display = 'none';
      } else {
        uploadBtnDom.style.display = 'flex';
      }
    }, 100);
  };

  watch(
    () => readonly,
    () => hideUploadImage(),
    {
      immediate: true
    }
  );

  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (!rawFile.type) {
      ElMessage.error('未获取到文件类型');
      return false;
    } else if (rawFile.size / 1024 / 1024 > maxSize) {
      ElMessage.error(`${fileTypeText.value}大小不能超过${maxSize}M`);
      return false;
    } else if (accept && !accept.toLowerCase().includes(getFileNameSuffix(rawFile.name).toLowerCase())) {
      ElMessage.error(`仅支持${accept}格式`);
      return false;
    }
    disabled.value = true;
    $emit('beforeUplode', 'start');
    return true;
  };

  const handleRemove: UploadProps['onRemove'] = (_file, files) => {
    const list = files || [];
    _fileList.value = list;
    $emit('change', list);
  };

  const handleProgress: UploadProps['onProgress'] = (e) => {
    if (e.percent === 100) {
      $emit('beforeUplode', 'end');
    }
  };

  const handlePreview: UploadProps['onPreview'] = (file) => {
    if (fileType === FileType.IMAGE) {
      imageViewer(file.url!);
    } else if (fileType === FileType.VIDEO) {
      curVideoUrl.value = file.url!;
      showVideo.value = true;
    } else if (fileType === FileType.FILE) {
      window.open(file.url);
    }
  };

  const handleExceed: UploadProps['onExceed'] = (files) => {
    if (limit === 1) {
      uploadRef.value!.clearFiles();
      const file = files[0] as UploadRawFile;
      file.uid = genFileId();
      uploadRef.value!.handleStart(file);
      uploadRef.value!.submit();
    } else {
      ElMessage.warning(`最多上传${limit}个${fileTypeText.value}`);
    }
  };

  const handleSuccess: UploadProps['onSuccess'] = (res: ApiResponseData<UploadFileResponse>, file, files) => {
    disabled.value = false;
    let list: UploadSuccessFiles = [];
    if (+res.code === 200) {
      ElMessage.success('上传成功！');
      if (limit === 1) {
        list = [
          {
            ...file,
            ...res.data,
            url: res.data.ossUrl
          }
        ];
      } else {
        list = cloneDeep(files).map((item) => {
          if (item.status === 'success' && item.uid === file.uid) {
            return {
              ...item,

              ...res.data,
              url: res.data.ossUrl
            };
          }
          return item;
        }) as UploadSuccessFiles;
      }
      _fileList.value = list;
      $emit('change', list);
    } else {
      ElMessage.error(res.message);
    }
  };

  const handlerError = () => {
    ElMessage.error('上传失败');
    disabled.value = false;
  };
</script>

<template>
  <div ref="uploadWrapper" style="width: 100%">
    <el-upload
      ref="uploadRef"
      class="upload-file"
      :file-list="_fileList"
      :action="baseUrl + apiUrl"
      :name="name"
      :headers="{
        ['Access-Token']: userStore.token
      }"
      :list-type="listType"
      :show-file-list="showFileList"
      :drag="drag"
      :multiple="multiple"
      :accept="accept"
      :limit="limit"
      :disabled="disabled"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-error="handlerError"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
    >
      <slot>
        <el-icon v-if="listType === 'picture-card'"><Plus /></el-icon>
        <el-button v-else type="primary" :disabled="disabled">上传</el-button>
      </slot>
      <template #tip>
        <div v-if="!disabled" class="tip-wrap">
          <slot name="tip">
            <div>提示：支持格式为{{ accept }}, 大小不超过{{ maxSize }}M</div>
          </slot>
        </div>
      </template>
    </el-upload>

    <!-- 视频播放弹框 -->
    <VideoPlayer v-model="showVideo" :url="curVideoUrl" />
  </div>
</template>

<style lang="scss" scoped>
  .upload-file {
    width: 100%;

    :deep(.el-upload-list--picture-card) {
      .el-upload-list__item {
        width: 100px;
        height: 100px;
      }
    }

    :deep(.el-upload--picture-card) {
      width: 100px;
      height: 100px;
    }

    :deep(.is-disabled) {
      .el-upload-list__item-status-label {
        display: none;
      }
    }

    .tip-wrap {
      margin-top: 8px;
      font-size: 12px;
      line-height: 1.5;
      color: #999999;
    }
  }
</style>
