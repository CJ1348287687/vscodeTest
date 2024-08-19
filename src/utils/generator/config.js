export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true
}

export const inputComponents = [
  {
    label: '单行文本',
    tag: 'el-input',
    tagIcon: 'input',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '多行文本',
    tag: 'el-input',
    tagIcon: 'textarea',
    type: 'textarea',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '密码',
    tag: 'el-input',
    tagIcon: 'password',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    'show-password': true,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '计数器',
    tag: 'el-input-number',
    tagIcon: 'number',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    min: undefined,
    max: undefined,
    step: undefined,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
  }
]

export const selectComponents = [
  {
    label: '下拉选择',
    tag: 'el-select',
    tagIcon: 'select',
    placeholder: '请选择',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: false,
    options: [{
      label: '选项一',
      value: 1
    }, {
      label: '选项二',
      value: 2
    }],
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/select'
  },
  {
    label: '级联选择',
    tag: 'el-cascader',
    tagIcon: 'cascader',
    placeholder: '请选择',
    defaultValue: [],
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    props: {
      props: {
        multiple: false
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    required: true,
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    dataType: 'dynamic',
    labelKey: 'label',
    valueKey: 'value',
    childrenKey: 'children',
    separator: '/',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
  },
  {
    label: '单选框组',
    tag: 'el-radio-group',
    tagIcon: 'radio',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: {},
    optionType: 'default',
    border: false,
    size: 'medium',
    disabled: false,
    required: true,
    options: [{
      label: '选项一',
      value: 1
    }, {
      label: '选项二',
      value: 2
    }],
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/radio'
  },
  {
    label: '多选框组',
    tag: 'el-checkbox-group',
    tagIcon: 'checkbox',
    defaultValue: [],
    span: 24,
    labelWidth: null,
    style: {},
    optionType: 'default',
    border: false,
    size: 'medium',
    disabled: false,
    required: true,
    options: [{
      label: '选项一',
      value: 1
    }, {
      label: '选项二',
      value: 2
    }],
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
  },
  {
    label: '开关',
    tag: 'el-switch',
    tagIcon: 'switch',
    defaultValue: false,
    span: 24,
    labelWidth: null,
    style: {},
    disabled: false,
    required: true,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/switch'
  },
  {
    label: '滑块',
    tag: 'el-slider',
    tagIcon: 'slider',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    disabled: false,
    required: true,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/slider'
  },
  {
    label: '时间选择',
    tag: 'el-time-picker',
    tagIcon: 'time',
    placeholder: '请选择',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    'picker-options': {
      selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
  },
  {
    label: '时间范围',
    tag: 'el-time-picker',
    tagIcon: 'time-range',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
  },
  {
    label: '日期选择',
    tag: 'el-date-picker',
    tagIcon: 'date',
    placeholder: '请选择',
    defaultValue: null,
    type: 'date',
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
  },
  {
    label: '日期范围',
    tag: 'el-date-picker',
    tagIcon: 'date-range',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    required: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
  },
  {
    label: '评分',
    tag: 'el-rate',
    tagIcon: 'rate',
    defaultValue: 0,
    span: 24,
    labelWidth: null,
    style: {},
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/rate'
  },
  {
    label: '颜色选择',
    tag: 'el-color-picker',
    tagIcon: 'color',
    defaultValue: null,
    labelWidth: null,
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    required: true,
    size: 'medium',
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
  },
  {
    label: '上传',
    tag: 'el-upload',
    tagIcon: 'upload',
    action: 'https://jsonplaceholder.typicode.com/posts/',
    defaultValue: null,
    labelWidth: null,
    disabled: false,
    required: true,
    accept: '',
    name: 'file',
    'auto-upload': true,
    showTip: false,
    buttonText: '点击上传',
    fileSize: 2,
    sizeUnit: 'MB',
    'list-type': 'text',
    multiple: false,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/upload'
  }
]

export const layoutComponents = [
  {
    layout: 'rowFormItem',
    tagIcon: 'row',
    type: 'default',
    justify: 'start',
    align: 'top',
    label: '行容器',
    layoutTree: true,
    children: [],
    document: 'https://element.eleme.cn/#/zh-CN/component/layout'
  },
  {
    layout: 'colFormItem',
    label: '按钮',
    changeTag: true,
    labelWidth: null,
    tag: 'el-button',
    tagIcon: 'button',
    span: 24,
    default: '主要按钮',
    type: 'primary',
    icon: 'el-icon-search',
    size: 'medium',
    disabled: false,
    document: 'https://element.eleme.cn/#/zh-CN/component/button'
  }
]

// 容器
export const containerComponents = [
   {
    layout: 'rowFormItem',
    tagIcon: 'row',
    type: 'default',
    justify: 'start',
    align: 'top',
    label: '条件容器',
	name:'条件容器',
    layoutTree: true,
    children: [],
	lx:'rongqi',
	fail:'',
	success:'',
	num:0,
	activnume:0,
	elemNum:0,
	elemUseNum:0,
	elemAllFlag:false,
	jhNumList:[
		{ name:'最少激活数量',label:false },
		{ name:'最多激活数量',label:true }
	],
	name:'条件容器',
	dragout:{
		name: "itxstaaa",
		put: true, //可以拖入
		pull: false,
	}
  },
  {
    layout: 'rowFormItem',
    tagIcon: 'row',
    type: 'default',
    justify: 'start',
    align: 'top',
    label: '非条件容器',
	name:'非条件容器',
    layoutTree: true,
    children: [],
	lx:'rongqi',
	vModel:'',
	fail:'',
	success:'',
	num:0,
	activnume:0,
	elemNum:0,
	elemUseNum:0,
	name:'非条件容器',
	dragout:{
		name: "componentsGroup",
		put: true, //可以拖入
		pull: true,
	}
  },
]

// 组件rule的触发方式，无触发方式的组件不生成rule
export const trigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
}


//容器控件列表
export const containerControlListComponents = [
  {
    label: '单行文本',
    tag: 'el-input',
    tagIcon: 'input',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
  {
    label: '多行文本',
    tag: 'el-input',
    tagIcon: 'textarea',
    type: 'textarea',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input'
  },
	{
	  label: '下拉选择',
	  tag: 'el-select',
	  tagIcon: 'select',
	  placeholder: '请选择',
	  defaultValue: undefined,
	  span: 24,
	  labelWidth: null,
	  style: { width: '100%' },
	  clearable: true,
	  disabled: false,
	  required: true,
	  filterable: false,
	  multiple: false,
	  options: [{
	    label: '选项一',
	    value: 1
	  }, {
	    label: '选项二',
	    value: 2
	  }],
	  regList: [],
	  changeTag: true,
	  document: 'https://element.eleme.cn/#/zh-CN/component/select'
	},
	{
	  label: '单选框组',
	  tag: 'el-radio-group',
	  tagIcon: 'radio',
	  defaultValue: undefined,
	  span: 24,
	  labelWidth: null,
	  style: {},
	  optionType: 'default',
	  border: false,
	  size: 'medium',
	  disabled: false,
	  required: true,
	  options: [{
	    label: '选项一',
	    value: 1
	  }, {
	    label: '选项二',
	    value: 2
	  }],
	  regList: [],
	  changeTag: true,
	  document: 'https://element.eleme.cn/#/zh-CN/component/radio'
	},
	{
	  label: '多选框组',
	  tag: 'el-checkbox-group',
	  tagIcon: 'checkbox',
	  defaultValue: [],
	  span: 24,
	  labelWidth: null,
	  style: {},
	  optionType: 'default',
	  border: false,
	  size: 'medium',
	  disabled: false,
	  required: true,
	  options: [{
	    label: '选项一',
	    value: 1
	  }, {
	    label: '选项二',
	    value: 2
	  }],
	  regList: [],
	  changeTag: true,
	  document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
	},
	// {
	//   label: '图片',
	//   tag: 'el-image',
	//   tagIcon: 'checkbox',
	//   defaultValue: [],
	//   span: 24,
	//   labelWidth: null,
	//   style: {width:'220px'},
	//   optionType: 'default',
	//   border: false,
	//   size: 'medium',
	//   disabled: false,
	//   required: true,
	//   src: 'https://img0.baidu.com/it/u=1414232962,2149362867&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
	//   regList: [],
	//   changeTag: true,
	//   document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
	// },
	
	// {
	//   label: '图片',
	//   tag: 'img',
	//   tagIcon: 'img',
	//   defaultValue: undefined,
	//   span: 24,
	//   labelWidth: null,
	//   style: {},
	//   optionType: 'img',
	//   border: false,
	//   size: 'medium',
	//   options: [{
	// 		  img:'https://img0.baidu.com/it/u=1414232962,2149362867&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
	// 		  id:1
	// 	  }],
	//   regList: [],
	
	// },
	
]