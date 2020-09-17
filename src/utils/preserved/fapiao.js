import {dateFormat} from './utils'
export default function (ret) {
    if(ret.templateSign == 'others'){
        return {
            title: '其他',
            right_title1: '',
            right_title2: '未知金额',
            left_title1: '暂无时间',
            left_title2: '暂无单位',
            invoice_date: new Date(),
            invoice_wanlai: "",
            invoice_money: "",
            detail: [],
            fp_type: ret.templateSign
        }
    }
    console.dir({...ret.ret})
    function getValue(label){
        try{
            var data = ret && ret.ret? ret.ret: [];
            var item =data.find(el => el.word_name == label) || {};
            return item.word || ""
        }catch(e){
            return ''
        }
    }
    var obj = {
        title: ret.templateName,
        type: ret.templateSign,
        invoice_date: getValue("InvoiceDate") || new Date(),
        invoice_money: getValue("AmountInFiguers") || 0,
        invoice_wanlai: "",
        left_title1: getValue("InvoiceDate") || '未知日期',
        left_title2: getValue("SellerName") || "",
        right_title1: '￥' + getValue("AmountInFiguers"),
        right_title2: getValue("TotalTax")? '税额: ￥' + getValue("TotalTax") : '' ,
        detail: ret.ret,
        uuid: ret.templateSign + Date.now()
    }
    if(ret.templateSign == "vat_invoice") { //增值税发票
        obj.title = ret.templateName + `(${getValue("InvoiceType")})`;
        obj.invoice_date =  getValue("InvoiceDate").replace(/[年月]/g,'/').replace(/日/,"");
        obj.invoice_wanlai = getValue("SellerName");
        obj.uuid = `${getValue('InvoiceCode')},${getValue('InvoiceNum')},${getValue('InvoiceDate')}`;
    }else if(ret.templateSign == 'taxi') { //出租车
        obj.invoice_money = getValue('Fare');
        obj.right_title1 = getValue("Fare") || 0;
        obj.right_title2 = "";
        obj.left_title1 = "日期: " + getValue("Date") ;
        obj.left_title2= "时间: "+ getValue("Time");
    }else if(ret.templateSign == "roll_ticket") { //卷票 ok
        obj.title =  ret.templateName + "("+getValue("InvoiceType")+")";
        obj.right_title2 = '';
        obj.uuid = `${getValue('InvoiceCode')},${getValue('InvoiceNum')},${getValue('InvoiceDate')}`;
    }else if(ret.templateSign == "quota_invoice") {
        obj.right_title1 = getValue("invoice_rate");
        obj.right_title1 = '发票号码: ' + getValue("invoice_number");
    }else if(ret.templateSign == "travel_itinerary"){ //飞机票 ok
        obj.left_title1 = getValue("issued_date");
        obj.left_title2 = getValue("issued_by");
        obj.right_title1 = '￥' + getValue("ticket_rates");
        obj.right_title2 = '票价:￥' + getValue("fare");
        obj.invoice_money = getValue("ticket_rates");
        obj.invoice_date = getValue("issued_date");
        obj.invoice_wanlai = getValue('issued_by');
    }else if(ret.templateSign == "train_ticket") { //火车票 ok
        obj.left_title1 = getValue("starting_station") +" -> " + getValue("destination_station");
        obj.right_title1 = getValue("ticket_rates")
        obj.left_title2 = getValue("time");
        obj.invoice_money = getValue("ticket_rates");
    }
    obj.right_title1 = '￥' + Number(String(obj.right_title1).match(/[\d.]+/)).toFixed(2);
    obj.invoice_money = Number(String(obj.invoice_money).match(/[\d.]+/)).toFixed(2);
    obj.invoice_date = obj.invoice_date instanceof Date? obj.invoice_date: new Date(obj.invoice_date.replace(/-/g,'/'))

    return obj;

}


