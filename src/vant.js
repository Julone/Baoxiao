import Vue from 'vue'
import 'vant/lib/icon/local.css';
import {
    Toast, Dialog, Divider, CheckboxGroup, Checkbox, Radio, RadioGroup, Field,
    Button, Cell, CellGroup, Circle, Icon,Sticky, Form, Tag, PullRefresh, List,
    Collapse, CollapseItem, NavBar, Tabbar, TabbarItem,Overlay,Grid,GridItem,
    Tabs,Tab,DatetimePicker,Stepper,Uploader,DropdownMenu,DropdownItem,
    SwipeCell, Popup, Lazyload, Empty, Loading,Image, Skeleton, Progress, Search, 
    Swipe, SwipeItem, NoticeBar, Row,Col,Rate, Picker, Sidebar,SidebarItem,
    Switch
} from 'vant'

DatetimePicker.props['swipe-duration'] = {type:Number, default: 600};

Vue.use(Toast).use(Dialog).use(Divider).use(Checkbox).use(CheckboxGroup)
.use(Radio).use(RadioGroup).use(Field).use(Button)
.use(Cell).use(CellGroup).use(Circle).use(Icon).use(Sticky)
.use(Form).use(Tag).use(PullRefresh).use(List).use(Collapse).use(CollapseItem)
.use(NavBar).use(Tabbar).use(TabbarItem).use(Tabs).use(Tab).use(SwipeCell)
.use(Popup).use(Lazyload).use(Empty).use(Loading).use(Image).use(Skeleton)
.use(Progress).use(Search).use(Swipe).use(SwipeItem).use(NoticeBar)
.use(Row).use(Col).use(Rate).use(Picker).use(Sidebar).use(SidebarItem)
.use(DatetimePicker).use(Stepper).use(Uploader)
.use(DropdownMenu).use(DropdownItem).use(Overlay)
.use(Grid).use(GridItem).use(Switch)