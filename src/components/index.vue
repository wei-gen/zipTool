<template>
  <div class="index">
      <button @click="chinese">中英互学</button>
      <button @click="reader">阅读器</button>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
  },
  methods: {
    chinese(){
      this.$router.push('/chinese')
    },
    reader(){
      this.$router.push('/reader')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
