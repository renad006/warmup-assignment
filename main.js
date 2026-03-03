const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function convertTimeToMinutes(timeString){
    //hh:mm:ss am
    //012345678910
    // let h, m, s, duration;
    // if(timeString.length===10){
    //  h=timeString.slice(0,1);
    //  m=timeString.slice(3,4);
    //  s=timeString.slice(6,7);
    //  duration = timeString.slice(9, 10).toUpperCase();
    // }
    //h:mm:ss am
    //0123456789
    // else if(timeString.length===9){
    //  h=timeString.slice(0);
    //  m=timeString.slice(2,3);
    //  s=timeString.slice(5,6);
    //  duration = timeString.slice(8,9).toUpperCase();
    // }
    // Parse the time string - format can be "h:mm:ss am" or "hh:mm:ss am"
    let timePart, duration;
    
    // Split into time and AM/PM parts
    let parts = timeString.split(' ');
    if (parts.length !== 2) {
        throw new Error('Invalid time format');
    }
    timePart = parts[0];  // "6:01:20" or "7:30:00"
    duration = parts[1].toUpperCase(); // "AM" or "PM"
    
    // Split time into hours, minutes, seconds
    let timeComponents = timePart.split(':');
    if (timeComponents.length !== 3) {
        throw new Error('Invalid time format');
    }
    let h = parseInt(timeComponents[0]);
    let m = parseInt(timeComponents[1]);
    let s = parseInt(timeComponents[2]);
//converting to int
    let hours=parseInt(h);
    let minutes=parseInt(m);
    let seconds=parseInt(s);
//converting to minutes
    if(duration==="PM" && hours!==12)
        hours+=12;
    else if(duration==="AM" && hours===12)
        hours=0;
    else hours=hours;
    hours=hours*60;
    seconds=seconds/60;
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    if (minutes === 60) {
        minutes = 0;
        hours += 1;
    }
    let finalTimeinminutes=hours+minutes+seconds;
    return Math.round(finalTimeinminutes * 1000) / 1000;
    //return finalTimeinminutes;
}
function convertBack(timeInMinutes){
    let hour=Math.trunc(timeInMinutes/60);
    timeInMinutes=timeInMinutes % 60; 
    let minute=Math.trunc(timeInMinutes);
    let second=Math.round((timeInMinutes - minute) * 60);
    if (second === 60) {
        second = 0;
        minute += 1;
    }
    if (minute === 60) {
        minute = 0;
        hour += 1;
    }
    let formattedMinutes = minute < 10 ? '0' + minute : minute;
    let formattedSeconds = second < 10 ? '0' + second : second;
    return `${hour}:${formattedMinutes}:${formattedSeconds}`
}
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
    startMinutes=convertTimeToMinutes(startTime);
    endMinutes=convertTimeToMinutes(endTime);
    if(startMinutes>endMinutes){
        endMinutes+=24*60;
    }
    let shiftInminutes=endMinutes-startMinutes;
    return convertBack(shiftInminutes);
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function timeStringToMinutes(timeStr) {
    let parts = timeStr.split(':');
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);
    let seconds = parseInt(parts[2]);
    return (hours * 60) + minutes + (seconds / 60);
}
function calculateActiveTime(STime,ETime){
    //static shift from 8am to 10pm 14 hours yaane 840 minutes
    //8am 08:00:00 am=480  10pm 10:00:00 pm=600
    let startMinutes=convertTimeToMinutes(STime);
    let endMinutes=convertTimeToMinutes(ETime);
    let activeStart, activeEnd;
    if(startMinutes>=1320 && endMinutes<=480 && startMinutes>endMinutes)
        return "00:00:00";
    else if(startMinutes<=480)
        activeStart=480;//8AM
    else if(startMinutes>=480 && startMinutes<=1320)
        activeStart=startMinutes;//ebtaded baad ma l shift ebtada w abl ma ykhlas

    if(endMinutes<=1320)
        activeEnd=endMinutes;
    else if(endMinutes>=1320)
        activeEnd=1320//10PM

    let activeTime=activeEnd-activeStart;//rakam in minutes
    return convertBack(activeTime)

}
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
    //returning hh:mm:ss am/pm (need to convert later for the calculations)
    let totalShiftTime=getShiftDuration(startTime, endTime);
    //helper calculateActiveTime b7ot feha el conditions btaaty baa (3 cond.)
    let activeTime=calculateActiveTime(startTime, endTime);
    //simple calculation left
    let totalMinutes=timeStringToMinutes(totalShiftTime);//got no am/pm
    let activeMinutes=timeStringToMinutes(activeTime);
    let idleMinutes=totalMinutes-activeMinutes;
    return convertBack(idleMinutes);
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
    let shiftMinutes=timeStringToMinutes(shiftDuration);
    let idleMinutes=timeStringToMinutes(idleTime);
    let activeMinutes=shiftMinutes-idleMinutes;
    if(activeMinutes<0)
        activeMinutes=0;
    return convertBack(activeMinutes);

}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
    let quota;
    if (date>="2025-04-10" && date<="2025-04-30")
        quota = 360;
    else
        quota = 504;
    let activeMinutes=timeStringToMinutes(activeTime);

    return activeMinutes>=quota;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
