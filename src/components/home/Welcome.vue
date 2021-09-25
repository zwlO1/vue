<template>
  <div class="CarouselWraper">
    <!-- 图片 -->
    <div
      class="Carousel"
      v-for="(img,index) in carouselImg"
      v-show="carouselIndex==index"
      @click="imgNext"
    >
      <img :src="img.path" :alt="img.alt" @mouseover="loop=false" @mouseout="loop=true" />
    </div>
    <!-- 焦点 -->
    <ul class="focus" @mouseover="loop=false" @mouseout="loop=true">
      <li
        :class="carouselIndex==index?'active':false"
        v-for="(value,index) in carouselImg.length"
        @mouseover="imgTurn(index)"
      ></li>
    </ul>
    <!-- 左右控件 -->
    <span class="left" @click="imgPrev">&lt;</span>
    <span class="right" @click="imgNext">&gt;</span>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      // 轮播图 
      carouselImg: [{
        alt: 'saber',
        path: require('@/assets/img/saber.png')
      }, {
        alt: 'exc',
        path: require('@/assets/img/saber2.png')
      }, {
        alt: 'glb',
        path: require('@/assets/img/saber3.png')
      }],
      // 当前要展示的索引
      carouselIndex: 0,
      timer: null,
      loop: true,
    }
  },
  methods: {
    imgAuto() {
      let that = this
      this.timer = setInterval(() => {
        // console.log(that.loop);
        if (that.loop)
          that.imgNext()
      }, 3000)
    },
    imgTurn(index) {
      //溢出检测
      this.carouselIndex = index
    },
    imgPrev() {
      // console.log(this.carouselImg.length); //[0,1] 2
      if (this.carouselIndex <= 0)
        this.carouselIndex = this.carouselImg.length - 1
      else this.carouselIndex--
    },
    imgNext() {
      if (this.carouselIndex >= this.carouselImg.length - 1)
        this.carouselIndex = 0
      else this.carouselIndex++
    }
  },
  mounted() {
    this.imgAuto();
  }
}
</script>

<style scoped>
/* 轮播图 */
.CarouselWraper {
  display: block;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 400px;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
}

/* 图片 */
.Carousel {
  /* left: 100px; */
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

/* 图片像素展示问题 */
.Carousel img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 焦点 */
.focus {
  position: absolute;
  bottom: 5%;
  left: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.focus li {
  /* list-style: none; */
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  background: white;
}

.focus li.active {
  background: #e9470acc;
}

.focus li:last-child {
  margin-right: 0;
}

/* 左右 */
.left,
.right {
  position: absolute;
  top: 50%;
  display: block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  color: #e9470acc;
  cursor: pointer;
}

.left {
  left: 0;
}

.right {
  right: 0;
}
</style>