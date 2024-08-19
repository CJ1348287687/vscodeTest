<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      highlight-current-row
      @select-all="onSelectAll"
      @selection-change="selectItem"
      @row-click="onSelectOp"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="手机号码" prop="province" align="center" />
    </el-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      tableData: [{
          name: '王小虎1',
          province: '上海1',
        }, {
          name: '王小虎2',
          province: '上海2',
        }, {
          name: '王小虎3',
          province: '上海3',
        }, {
          name: '王小虎4',
          province: '上海4',
        }],
				arr:[
					{
						name: '王小虎4',
					}
				]
    }
  },
  mounted(){
	  this.$nextTick(() => {
	    setTimeout(() => {
	      this.tableData.forEach(item => {
	        if (item.name === '王小虎4') {
	          this.$refs.multipleTable.toggleRowSelection(item, true);
	          this.multipleSelection.push(item);
	        }
	      });
	    }, 0);
	  });
  },
  methods: {
    onSelectAll() {
      this.$refs.multipleTable.clearSelection();
    },
    selectItem(rows) {
		console.log(rows,'rows-----')
      if (rows.length > 1) {
        const newRows = rows.filter((it, index) => {
          if (index == rows.length - 1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
            return true;
          } else {
            this.$refs.multipleTable.toggleRowSelection(it, false);
            return false;
          }
        });
        this.multipleSelection = newRows;
      } else {
        this.multipleSelection = rows;
      }
      // this.userId = this.multipleSelection.length? this.multipleSelection[0].guid: "";
      console.log('2',this.multipleSelection)
    },
    onSelectOp(row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row, true);
      this.multipleSelection = [];
      this.multipleSelection.push(row);
    },
  }
};
</script>