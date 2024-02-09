class DateFunction {
    static formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
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
        var month = date.substr(5, 2);
        var day = '01';
        var year = date.substr(0, 4);


        return [year, month, day].join('-');
    }
    static lastDayMonth(date) {
        //2022-12-29       
        var year = date.substr(0, 4);
        var month = date.substr(5, 2);
        var dateDay = new Date(date);
        var day = (new Date(dateDay.getFullYear(), dateDay.getMonth() + 1, 0)).getDate();


        return [year, month, day].join('-');
    }

    static newDate() {
        var date = new Date();
        var dateStr = this.formatDate(date);
        return dateStr;
    }
    static getTime() {
        var d = new Date(),
            hour = '' + (d.getHours()),
            minunte = '' + d.getMinutes();
        if (minunte < 10) minunte = ['0', minunte].join('');

        return [hour, minunte].join(':');
    }
    static weekDay(date) {
        var days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        var now = new Date(date);
        return days[now.getDay()];
    }
    static getMonthNumber(month) {
        var months = [
            "JANEIRO",
            "FEVEREIRO",
            "MARÇO",
            "ABRIL",
            "MAIO",
            "JUNHO",
            "JULHO",
            "AGOSTO",
            "SETEMBRO",
            "OUTUBRO",
            "NOVEMBRO",
            "DEZEMBRO"
        ];
        for (var i = 0; i < 12; i++) {
            if (months[i] == month) {
                return i + 1;
            }
        }
        return 1;
    }
    static getMonthDays(month,year) {
        var months = [
            "JANEIRO",
            "FEVEREIRO",
            "MARÇO",
            "ABRIL",
            "MAIO",
            "JUNHO",
            "JULHO",
            "AGOSTO",
            "SETEMBRO",
            "OUTUBRO",
            "NOVEMBRO",
            "DEZEMBRO"
        ];
        var digMonth = 1;
        for (var i = 0; i < 12; i++) {
            if (months[i] == month) {
                digMonth = i + 1;
            }
        }
               
        const ultimoDiaDoMes = new Date(year, digMonth, 0);

        // O método getDate() retorna o dia do mês
        return ultimoDiaDoMes.getDate();
        
    }
}

module.exports = DateFunction;

