

<template>
    <!-- 工具栏 -->
    <div class="toolbar">
        <div class="operate">
            <span class="toolbar-menu-btn forbiden" title="上传文件"><i class="iconfont icon-top"></i>Upload <input type="file" class="cc-upload-btn" id="cc-index-upload-btn" title="上传文件" accept=".zip,.txt,.pdf" onchange="ccFile.upload($(this))"></span>
            <span class="toolbar-menu-btn forbiden" title="编辑文件" onclick="ccSearch.showFile($(this))"><i class="iconfont icon-feedback"></i>Edit</span>
            <span class="toolbar-menu-btn forbiden" title="删除文件" data-type="delete" onclick="ccSearch.showTips($(this))"><i class="iconfont icon-delete"></i>Delete</span>
            <span class="toolbar-menu-btn forbiden" title="粉碎文件" data-type="smash" onclick="ccSearch.showTips($(this))"><i class="iconfont icon-clear"></i>Clear</span>
            <span class="toolbar-menu-btn forbiden" title="打开所在目录" onclick="ccSearch.openCatalog($(this))"><i class="iconfont icon-file"></i>Open</span>
        </div>

        <div class="more">
            <span title="More" onclick="ccFile.showOrderMenu(event,'{{model}}')"><i class="iconfont icon-more"></i></span>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px var(--spacing-s);

    border-bottom: var(--border-style-solid) var(--border-width-default) var(--border-color-default);
    background-color: var(--background-color-secondary);

    .operate,.more {
        display: flex;
        align-items: center;

        span {
            position: relative;
            width: fit-content;
            height: var(--size-s);
            line-height: var(--size-s);
            padding: var(--spacing-xxs) var(--spacing-s);
            margin-right: var(--spacing-m);

            color: var(--content-color-secondary);
            font-size: var(--text-size-m);

            cursor: pointer;
            border-radius: var(--border-radius-default);
            overflow: hidden;

            i { margin-right: var(--spacing-xxs)}

            input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                opacity: 0;
            }

            &:hover {
                color: var(--content-color-primary);
                background: var(--highlight-background-color-primary);
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
