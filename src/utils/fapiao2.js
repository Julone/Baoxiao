import {dateFormat} from './utils'
export default function (data) {
    var getValue = getValue2.bind(data);
    var obj = {...data};
    obj.imgurl = obj.imgurl.replace('../', 'http://webt.lilang.com:9001/');
    if(data.templateSign == "vat_invoice") { //增值税发票
        obj.invoice_money = getValue('jshj');
        obj.invoice_date =  getValue("kprq").replace(/[年月日]/g,'/').slice(0,-1)
        obj.invoice_wanlai = getValue("xfmc");
        obj.needCheck = true
    }else if(data.templateSign == 'taxi') { //出租车
        obj.invoice_money = getValue('Fare');
        obj.invoice_date = getValue('Date');
        obj.invoice_wanlai = "";
    }else if(data.templateSign == "roll_ticket") { //卷票 ok
        obj.invoice_money = getValue('jshj');
        obj.invoice_date =  getValue("kprq").replace(/[年月日]/g,'/')
        obj.invoice_wanlai = getValue("xfmc") || "";
        obj.needCheck = true
    }else if(data.templateSign == "quota_invoice") { 
     
    }else if(data.templateSign == "travel_itinerary"){ //飞机票 ok
        obj.invoice_money = getValue("ticket_rates");
        obj.invoice_date = getValue("issued_date");
        obj.invoice_wanlai = getValue('issued_by');
    }else if(data.templateSign == "train_ticket") { //火车票 ok
        obj.invoice_money = getValue("ticket_rates");
        obj.invoice_date = "";
        obj.invoice_wanlai = "";
    }
    obj.invoice_money = Number(String(obj.invoice_money).match(/[\d.]+/)).toFixed(2);
    if(obj.invoice_date) {
        obj.invoice_date = (obj.invoice_date instanceof Date && obj.invoice_date.toString() != "Invalid Date")? 
        obj.invoice_date:new Date(obj.invoice_date.replace(/-/g,'/'))
    }
    return obj;
}

function getValue2(key) { 
    return this[key] || ""
}

