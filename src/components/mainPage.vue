<template>
    <el-card class="box-card">
        <div class="author-info flex">
            <el-avatar :size="100" :src="videoInfo.avatar"/>
        </div>
        <div class="box-message flex">
            <el-alert
                    class="alert"
                    title="本站公告"
                    type="info"
                    :closable="false"
                    description="图集解析仅抖音/快手/微博/皮皮虾/最右/皮皮搞笑可用，哔哩哔哩/6间房/微博仅支持下载无法去除水印，解析失败请 留言反馈"
                    show-icon
            />
            <el-alert
                    class="alert"
                    title="目前支持 "
                    type="success"
                    :closable="false"
                    description="皮皮虾/抖音/微视/快手/6间房/哔哩哔哩/微博/绿洲/度小视/开眼/陌陌/皮皮搞笑/全民k歌/逗拍/虎牙/新片场/哔哩哔哩/Acfun/美拍/西瓜视频/火山小视频/网易云Mlog/好看视频"
                    show-icon
            />
            <el-alert
                    class="alert"
                    title="温馨提示"
                    type="warning"
                    :closable="false"
                    description="粘贴视频地址时无需删除文案 但如果视频链接正确但解析失败请删掉文案后重试"
                    show-icon
            />
        </div>
        <div class="box-input" v-loading="loading">
            <el-input
                    v-model="urlInfo.url"
                    placeholder="请输入解析链接"
                    size="large"
                    class="input-with-select"
            >
                <template #prepend>
                    <el-select v-model="urlInfo.urlType" placeholder="Select" size="large" style="width: 80px">
                        <el-option label="视频" value="video"/>
                        <el-option label="图集" value="atlas"/>
                    </el-select>
                </template>
                <template #append>
                    <el-button @click="submitBtn">解析</el-button>
                </template>
            </el-input>
        </div>
        <div class="box-info">
            <el-empty description="没有信息" v-if="typeInfo==='empty'"/>
            <div v-else-if="typeInfo==='video'">
                <div class="btn-group">
                    <el-button type="success" round @click="downloadVideo('video')">下载视频</el-button>
                    <el-button type="success" round @click="downloadVideo('cover')">下载封面</el-button>
                    <el-button type="success" round @click="downloadVideo('music')">下载音乐</el-button>
                </div>
                <el-input v-model="videoInfo.title" placeholder="">
                    <template #prepend>视频标题</template>
                </el-input>
                <el-input v-model="videoInfo.author" placeholder="">
                    <template #prepend>视频作者</template>
                </el-input>
                <el-input v-model="videoInfo.cover" placeholder="">
                    <template #prepend>封面链接</template>
                </el-input>
                <el-input v-model="videoInfo.url" placeholder="">
                    <template #prepend>视频链接</template>
                </el-input>
                <el-input v-model="videoInfo.music.url" placeholder="">
                    <template #prepend>音乐链接</template>
                </el-input>
            </div>
            <div v-else>
                <div class="btn-group">
                    <el-select
                            v-model="imageList"
                            multiple
                            collapse-tags
                            placeholder="不选则默认下载全部"
                            style="width: 240px"
                    >
                        <el-option
                                v-for="(item,index) in atlasInfo.images"
                                :key="item.value"
                                :label="index+1"
                                :value="index"
                        />
                    </el-select>
                    <el-button type="success" @click="downloadAtlas">点击下载</el-button>
                </div>
                <div class="box-image">
                    <el-image style="height: 200px;margin: 5px 0" v-for="url in atlasInfo.images" :key="url"
                              :src="url"
                              lazy/>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import axios from "axios";
import {saveAs} from 'file-saver';

// 定义变量
let urlInfo = ref({
    urlType: 'video',
    url: ''
})
let videoInfo = ref({
    title: '', // 标题
    author: '', // 作者
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 头像链接
    cover: '', // 封面链接
    url: '', // 视频链接
    music: {url: ''}
})
let atlasInfo = ref({
    count: 0,
    images: []
})
let loading = ref(false)
let typeInfo = ref('empty')
let imageList = ref([])

function submitBtn() {
    loading.value = true
    if (urlInfo.value.url !== '') {
        if (urlInfo.value.urlType === 'video') {
            axios.post(`https://tenapi.cn/v2/video?url=${urlInfo.value.url}`,)
                .then(function (response) {
                    ElMessage({
                        type: response.data.code === 200 ? 'success' : response.data.code === 201 ? 'error' : 'info',
                        message: response.data.msg,
                        showClose: true,
                        grouping: true,
                        center: true
                    })
                    if (response.data.code === 200) {
                        for (let key in response.data.data) {
                            videoInfo.value[key] = response.data.data[key]
                        }
                        typeInfo.value = 'video'
                    }
                    loading.value = false
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios.post(`https://tenapi.cn/v2/images?url=${urlInfo.value.url}`,)
                .then(function (response) {
                    ElMessage({
                        type: response.data.code === 200 ? 'success' : response.data.code === 201 ? 'error' : 'info',
                        message: response.data.msg,
                        showClose: true,
                        grouping: true,
                        center: true
                    })
                    if (response.data.code === 200) {
                        atlasInfo.value = response.data.data
                        typeInfo.value = 'atlas'
                    }
                    loading.value = false
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    } else {
        ElMessage({
            type: 'error',
            message: '请输入解析链接',
            showClose: true,
            grouping: true,
            center: true
        })
        loading.value = true
    }
}

function downloadVideo(type) {
    if (type === 'video') {
        let hostType = videoInfo.value.url.indexOf('v3') !== -1 ? 'v3' : 'v5'
        let videoUrl = videoInfo.value.url.match(/(?<=com\/)\S*/g)[0]
        axios(`/${hostType}/${videoUrl}`, {
            responseType: 'blob'
        }).then(res => saveAs(res.data, 'video.mp4'))
    } else if (type === 'cover') {
        saveAs(videoInfo.value.cover, 'cover.png')
    } else {
        saveAs(videoInfo.value.music.url, 'music.mp3')
    }
}

function downloadAtlas() {
    if (imageList.value.length === 0) {
        for (let i = 0; i < atlasInfo.value.images.length; i++) {
            saveAs(atlasInfo.value.images[i], `${i + 1}.png`)
        }
    } else {
        for (let i = 0; i < imageList.value.length; i++) {
            saveAs(atlasInfo.value.images[imageList.value[i]], `${imageList.value[i] + 1}.png`)
        }
        imageList.value = []
    }
}
</script>

<style scoped>
.box-card {
    width: 100%;
    border-radius: 20px;
}

.box-card, .box-message, .box-info {
    margin: 20px 0;
}

.alert {
    margin: 5px 0;
}

.btn-group {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-image {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>