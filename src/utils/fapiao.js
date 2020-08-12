import {dateFormat} from './utils'
export default function (ret) {
    if(ret.templateSign == 'others'){
        return {
            title: '未知发票 - 其他',
            right_title1: '',
            right_title2: '未知金额',
            left_title1: '暂无时间',
            left_title1: '暂无单位',
            invoice_date: ""
        }
    }
    function getValue(label){
        var item =ret.ret.find(el => el.word_name == label) || {};
        return item.word || ""
    }
    var obj = {
        title: ret.templateName,
        invoice_date: getValue("InvoiceDate") || new Date(),
        invoice_money:  getValue("AmountInFiguers") || 0,

        left_title1: getValue("InvoiceDate") || '未知日期',
        left_title2: getValue("SellerName") || "",
        right_title1: '￥' + getValue("AmountInFiguers"),
        right_title2: getValue("TotalTax")? '税额: ￥' + getValue("TotalTax") : '' 
    }
   
    if(ret.templateSign == 'taxi') {
        obj.invoice_money = getValue('Fare').replace("¥","");
        obj.invoice_date = dateFormat(getValue("Date"),'yyyy年MM月dd日');
        obj.right_title1 = getValue("Fare");
        obj.right_title2 = getValue("TaxiNum");
        obj.left_title1 = "日期: " + getValue("Date") ;
        obj.left_title2= "时间: "+ getValue("Time");
    }else if(ret.templateSign == "roll_ticket") {
        obj.title = getValue("InvoiceType");
        obj.right_title2 = '';
    }else if(ret.templateSign == "quota_invoice") {
        obj.right_title1 = getValue("invoice_rate");
        obj.right_title1 = '发票号码: ' + getValue("invoice_number")
    }else if(ret.templateSign == "travel_itinerary"){
        obj.left_title1 = getValue("date");
        obj.left_title2 = getValue("issued_by");
        obj.right_title1 = '￥' + getValue("ticket_rates");
        obj.invoice_money = getValue("ticket_rates");
        obj.right_title2 = '附加费:￥' + getValue("fuel_surcharge")
    }

    return obj;

}
