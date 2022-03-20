const fs = require('fs');
let globalIDProvider = 0;

class file {
    constructor(name, year, month, tryfetch = true)
    {
        this.name = name;
        this.month = month;
        this.year = year;
        this.entires = [];
        if(tryfetch === true)
        {
            const jsonString = fs.readFileSync(`Data/${name + '-' + year + '-' + month}.json`, "utf-8");
            if(jsonString)
            {
                const us = JSON.parse(jsonString);
                if(us.entires !== null) 
                {
                    us.entries.forEach(data => {
                        this.entires.push({
                            ID: globalIDProvider++,
                            date: data.date,
                            code: data.code,
                            time: data.time,
                            description: data.description
                        });
                    });
                }
            }
        }
    }
    checkDate(name, year, month)
    {
        return this.name === name && this.year === year && this.month === month; 
    }
    checkUsername(name)
    {
        return this.name === name;
    }
    tryAdd(owner, year, month, obj)
    {
        if(this.checkDate(owner, year, month) === true) {
            this.entires.push({
                ID: globalIDProvider++,
                date: obj.date,
                code: obj.code,
                time: parseInt(obj.time),
                description: obj.description
            });
            this.saveFile();
            return true;
        }
        return false;
    }
    tryRemove(ID)
    {
        let removed = false;
        const newArray = [];
        this.entires.forEach(data => {
            if(data.ID === ID) {
                removed = true;
            } else {
                newArray.push(data);
            }
        })
        if(removed === true) {
            this.entires = newArray;
            this.saveFile();
        }
        return removed;
    }
    saveFile()
    {
        const locFile = { entries: [] };
        this.entires.forEach(data => {
            locFile.entries.push({
                date: data.date,
                code: data.code,
                time: parseInt(data.time),
                description: data.description
            });
        });
        const jsonData = JSON.stringify(locFile, null, "\t");
        fs.writeFileSync(`Data/${this.name + '-' + this.year + '-' + this.month}.json`, jsonData);
    }
}

module.exports = file;