// get varibls
let day = document.querySelector('.day')
let meladyDate = document.querySelector('.melady')
let hejryDate = document.querySelector('.hejry')
let selectCity = document.getElementById('city')
let span = document.querySelector('.head p span')
let header = document.querySelector('header')
let nDate = new Date()
let currentDate = nDate.getHours()
let hoursPure = []
let store = []
let hours
let nextPrayElement= document.createElement('p')
// Time array for each pray
let timesArr =[]
let citiesObj={
    "القاهره":"Cairo",
    "كفرالشيخ":"Kafr ash Shaykh",
    "الاسكندريه":"Al Iskandarīyah",
    "البحرالاحمر":"Al Baḩr al Aḩmar	",
    "اسوان":"Aswān",
    "مرسى مطروح":"Maţrūḩ",
    "شمال سيناء":"Shamāl Sīnā"
}
 
 async function getPrayData(city_time){ // API Function Get

    let getTime = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city_time}&country=EG&method=8`)
    let getJsonData = await getTime.json()
    let data = getJsonData.data 
    meladyDate.textContent= data.date.gregorian.date // melady date
    day.textContent = data.date.hijri.weekday.ar // name of day
    hejryDate.textContent = `${data.date.hijri.day} من ${data.date.hijri.month.ar} لعام ${data.date.hijri.year}` // higri gate 
    //  looping to get the times
    hoursPure=[] // empty to just update when we change the cities
    for([key ,value] of Object.entries(data.timings)){
        if(key=='Sunset'||key=='Imsak'||key=='Midnight'||key=='Firstthird'||key=='Lastthird'){
            continue
        }
        hoursPure.push(Number(value.split(":")[0]))
        
        if(value > "12:59" ){//  convert time from 24 sys to 12 
            value = Number(value.split("").splice(0,2).join("")-12).toString() + value.split("").splice(2).join("") + " م"
        }else{
            value = value + ' ص'
        }
        timesArr.push(value)
       
        hours = document.querySelectorAll('.hour')
        for(i=0 ; i<hours.length ;i++){
           
            hours[i].textContent = timesArr[i]
        }
        
    }
    store=[] // empty to just update when we change the cities
    // make the nearby pray   
        for(let d =0 ; d < hoursPure.length ; d++){
            store.push( hoursPure[d]-currentDate)
        }
        let manyHours;
        let nameOfNextPray;
        let x =0 ;
        let n ;
        do {
            x++
            n = store.indexOf(store[x])
            if(n < 0){
                
                 manyHours = store[0]+24
                 nameOfNextPray = hours[0].nextElementSibling.innerHTML
            }else{
                manyHours=store[n]
                nameOfNextPray = hours[n].nextElementSibling.innerHTML
            }
          } while (store[x] < 0);
        //  nameOfNextPray = hours[n].nextElementSibling.innerHTML         
        nextPrayElement.innerHTML = `الصلاة القادمه : ${nameOfNextPray} بعد اقل من ${manyHours} ساعات`
        nextPrayElement.classList.add('alarm')
        header.appendChild(nextPrayElement)
    localStorage.setItem('data',JSON.stringify(timesArr)) // save times in localstorage
    span.textContent = getKeyBuyValue(citiesObj,city_time)
    timesArr=[] // Empty it after the procces to get the new data when we changing the city
}

// create options  
for(let key in  citiesObj){
    selectCity.innerHTML += `<option value="${citiesObj[key]}" >${key}</option>`
}

// Changing times when we change city
selectCity.onchange = function changingCity(){
    getPrayData(selectCity.value)
    localStorage.setItem('city',JSON.stringify(selectCity.value))
    
}

//  save the data in local storage to restore it when we reload or reopen the page again
window.onload = function(){
    if(localStorage.getItem('city')){
        selectCity.value = JSON.parse(localStorage.getItem('city'))
        getPrayData(JSON.parse(localStorage.getItem('city')))
    }else{
        selectCity.value = 'Cairo'
        getPrayData('Cairo')
    }
}


function getKeyBuyValue(obj,value){
    return Object.keys(obj).filter(key => obj[key]== value)
}