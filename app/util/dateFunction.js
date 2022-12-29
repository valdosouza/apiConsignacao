class DateFunctions{
    static formatDate(date) {                
        var d = new Date(date),
            month = '' + (d.getMonth()),
            day = '' + d.getDate(),
            year = d.getFullYear();
        
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }    

    static firtDayMonth(date) {        
        
        //2022-12-29       
        var month = date.substr(5,2);
        var day = '01';
        var year = date.substr(0,4);
        
   
        return [year, month, day].join('-');
    }    
    static lastDayMonth(date) { 
        //2022-12-29       
        var year = date.substr(0,4);
        var month = date.substr(5,2);        
        var dateDay = new Date(date);
        var day = (new Date(dateDay.getFullYear(), dateDay.getMonth() + 1, 0) ).getDate();        
        
           
        return [year, month, day].join('-');
    }    
    
}

module.exports = DateFunctions;

