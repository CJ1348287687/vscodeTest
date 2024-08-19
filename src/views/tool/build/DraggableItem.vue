<script>
import draggable from 'vuedraggable'
import render from '@/utils/generator/render'

const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem,down,moveup } = this.$listeners
    return [
      // <span class="drawing-item-copy" title="复制" onClick={event => {
      //   copyItem(element, parent); event.stopPropagation()
      // }}>
      //   <i class="el-icon-copy-document" />
      // </span>,
	  <span class="drawing-item-moveup" title="上移" onClick={event => {
	    moveup(element, parent); event.stopPropagation()
	  }}>
	    <i class="el-icon-upload2" />
	  </span>,
	  <span class="drawing-item-copy" title="下移" onClick={event => {
	    down(element, parent); event.stopPropagation()
	  }}>
	    <i class="el-icon-download" />
	  </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}
const layouts = {
  colFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    return (
      <el-col span={element.span} class={className}
        nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        <el-form-item label-width={element.labelWidth ? `${element.labelWidth}px` : null}
          label={element.label} required={element.required}>
          <render key={element.renderKey} conf={element} onInput={ event => {
            this.$set(element, 'defaultValue', event)
          }} />
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    // const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'

	const className = (this.activeId === element.formId) ? 'drawing-row-item active-from-item' : (element.componentName  === '条件容器') ? 'drawing-row-item active-from-item-noisF' : (element.componentName  === '非条件容器') ? 'drawing-row-item active-from-item-isF' : 'drawing-row-item'


	// const typeClass = element.componentName === '条件容器' ? 'colorred' : 'colorblue'
	// console.log(typeClass,'typeClass-----');
    let child = renderChildren.apply(this, arguments)

   
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
              {child}
            </el-row>
    }

    return (
		<el-col span={element.span}>
		  <el-row gutter={element.gutter} class={className}
				  nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
			<span class="component-name">{element.componentName}</span>
			<draggable list={element.children} animation={340} group="componentsGroup"  class="drag-wrapper"  move={e=>{
				let to = e.to
				let text = to.previousElementSibling.innerHTML
			  if(e.draggedContext.element.targetType=="MEDIA_IMAGE" || e.draggedContext.element.targetType=="MEDIA_VIDEO" || e.draggedContext.element.targetType=="MEDIA_TEXT"){
			              // if(e.relatedContext.component.value == "条件容器"){
			              //   return false;
			              // }
						  if(text == "条件容器"){
						    return false;
						  }
			            }
			}}>
			  {child}
			</draggable>
			{components.itemBtns.apply(this, arguments)}
		  </el-row>
		</el-col>
    )
  }
}


function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}



export default {
  components: {
    render,
    draggable
  },
  data(){
    return{
      
    }
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf',
	'disable'
  ],
 //  props:{
	// bbb:{
		
	// },
 //    element:{
     
 //    },
 //    index:{
 //      // type:Number,
 //      // default:0
 //    },
 //    drawingList:{
 //      type:Array,
 //      default:[]
 //    },
 //    activeId:{
 //      type:String | Number,
 //      default:''
 //    },
 //    formConf:{
 //      type:Object,
 //      default:{}
 //    },
 //    aaa:{
 //      type:Object,
 //  //     default: () => ({
 //  //       name: "itxst",
 //  //       put: true, //可以拖入
	// 	// pull:false,
 //  //     })
 //    }
 //  },
  render(h) {
    const layout = layouts[this.element.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
