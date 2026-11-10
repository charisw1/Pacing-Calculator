const pCalc={
			conv:{
     text:{
         tA:{
             "mile":"mi",
             "kilometer":"km",
             "meter":"m",
             "mi":"mile",
             "km":"kilometer",
             "m":"meter"},
         cT:function(t){return pCalc.conv.text.tA[t]}},
     dist:{
         cN:{
             "mi_km":1.609341,
             "km_mi":0.621371,
             "m_km" :0.001,
             "km_m":1000,
             "mi_m":1609.34,
             "m_mi":0.000621371},
         cD:function (distance,firstUnit,secondUnit){
             const con=firstUnit+"_"+secondUnit; //puts the two abreviations together
             const convert=pCalc.conv.dist.cN[con]; // finds the abreviation number
             const newDistance=convert*distance;  //multiplies the distance by the conversion number
             return newDistance},// returns the distance
 
         cTFD: function(t,originalDistance,originalUnit,newUnit,newSplit){
             let newDistance=(pCalc.conv.dist.cD(originalDistance,originalUnit,newUnit)) // convert og distance to new distance so 5km- 3.2mi
             newDistance=Math.trunc(newDistance/newSplit)*newSplit // flatten new distance so 3.2 mi to 3mi
             newDistance=(pCalc.conv.dist.cD(newDistance,newUnit,originalUnit)) //convert new flat distance to km again 3mi to 4.82803km
             const ratio= newDistance/originalDistance // get the ratio so  4.82803km/5km
             let newTime=(t*ratio) // ratio the time
             newTime=Math.trunc(newTime) // flattens the time
             return(newTime)}},
     time:{
         sTM: function(s){
             let minute=(s)/60;// this creates the minutes
             minute=Math.trunc(minute);// makes minutes a whole number
             minute=String(minute)// turns minutes into string
             let second=s % 60    // modulo for seconds
             second= Math.trunc(second)    // shortens the seconds 
             second=String(second)
             if (second<10){second="0"+second}// add the 0 at the begining
             return minute + ":" +second},    //concatenates it for a time
         mTS: function(m,s){
             const minute= Number(m) // turns minutes into a number
             const second= Number(s)// turns seconds into a number
             const total=minute*60+second// multiplies minutes by 60 and adds seconds
             return total}}},
 split:{
     dist: function(s, n) {
         let b = Math.trunc(n / s);// see how manytimes n goes into s and rounding it
         const split = [];// creating the list that holds the splits
         for (let i = 0; i < b; i++) {let a = (i + 1) * s;
         if (!((a*1000)%1==0)){
             a=a*1000
             a= Math.round(a)
             a=a/1000}
         split.push(a);}   // loop that calculates each split
         return split;},// sending the information over
     time: function (tStart,tEnd,s){
         const amount= tEnd-tStart// first calculates the acctual times
         const times=[]// creates the list holder
         for (let i = 0; i < (s); i++){
             let split=((i+1)*amount)/s //time splits
             split+=tStart// calculates the start+ the splits
             split= Math.trunc(split)// flattens the splits
             times.push(split)}// adds split to array
         return times}}, // returns the times
 
 calc:{
     presets:{
         sixteenHundred:function(m,s){
             const b=pCalc.conv.time.mTS(m,s) // changes the minutes back to seconds
             const length=pCalc.split.dist(400,1600)// splits the 1600 into groups of 400
             const seconds=pCalc.split.time(0,b,4)// splits the time 4 times
             const time=[] // creates the array to change the seconds into minutes
             for (let i = 0; i < (4); i++){
                 const s=pCalc.conv.time.sTM(seconds[i]) // changes each second to minutes
                 time.push(s)}// addds it to an array
             const splits = []; // splits array
             for (let i = 0; i < 4; i++) {const s = `${length[i]} m ${time[i]}`; splits.push(s);} // creates a format distance, unit, time and adds it to the array
             return splits},// returns the array
         thirtyTwoHundred: function(m,s){
             const b=pCalc.conv.time.mTS(m,s) // changes the seconds and minutes to just seconds
             const length=pCalc.split.dist(400,3200) // splits the 3200 by 400
             const seconds=pCalc.split.time(0,b,8)// splits the time in 8 parts
             const time=[]// creates the time arrays to turn seconds into a time format
             for (let i = 0; i < (8); i++){const s=pCalc.conv.time.sTM(seconds[i]); time.push(s);} // loops through to make the time
             const splits = [];// maes the time splits
             for (let i = 0; i < 8; i++) {const s = `${length[i]} m ${time[i]}`;splits.push(s);}// creates the splits and sends it over to splits
             return splits}, // gives all the splits
         fiveKilometer: function(m,s){
             const b=pCalc.conv.time.mTS(m,s)// changes the minutes to seconds
             let length=pCalc.split.dist(1,3)// splits kilomrter distance
             let seconds=pCalc.split.time(0,b,5) // splits the time
             const ms=seconds[0]*1.609341*3 // takes the minute goal and cuts it short
             seconds=pCalc.split.time(0,ms,3)// splits the seconds again
             const splits=[] // create the splits
             for (let i = 0; i < 3; i++) {const s = `${length[i]}mi ${pCalc.conv.time.sTM(seconds[i])}`; splits.push(s);} // mile splits
             length=pCalc.split.dist(1,5)// uses the km splits
             seconds=pCalc.split.time(0,b,5)// splits the time into 5 parts
             for (let i = 0; i < 5; i++) {const s = `${length[i]}km ${pCalc.conv.time.sTM(seconds[i])}`;splits.push(s);}// km splits
             return splits}},
     customs:{ //
         singleCustom: function (distanceUnit,distanceSplitBy,distance,m,s){
             const timeDivide=Math.trunc(distance/distanceSplitBy)// divides the distance into parts
             const b=pCalc.conv.time.mTS(m,s)// changes the minutes to seconds
             const length=pCalc.split.dist(distanceSplitBy,distance)// splits up the length
             const seconds=pCalc.split.time(0,b,timeDivide)//splits up the time
             const splits=[]// create the array to store the splits
             for (let i = 0; i < timeDivide; i++) {const s= `${length[i]} ${distanceUnit}: ${pCalc.conv.time.sTM(seconds[i])}`;splits.push(s);}// formating and adding it to splits
             return splits},// returning splits
         doubleCustom: function (distanceUnits,distancesSplitBy,distance,m,s){
             m=Number(m)// changes minutes to a number
             s=Number(s)//changes seconds to a number
             const abbreviatedDistance = []; // array for the abreviations
             for (let distanceUnit of distanceUnits) {const abbreviation = pCalc.conv.text.cT(distanceUnit);abbreviatedDistance.push(abbreviation);}// changes the long unit short and then adds it to an array
             let allSplits=[]// the array that stores everything
             const t=m*60+s// changes minutes and seconds to just seconds
             const firstDistance=pCalc.calc.customs.singleCustom(distanceUnits[0],distancesSplitBy[0],distance,m,s)// gets the splits for the first distance
             allSplits.push(firstDistance)// adds it to the all splits
             const newDistance=pCalc.conv.dist.cD(distance,abbreviatedDistance[0],abbreviatedDistance[1])// changes the distance
             let newTime=pCalc.conv.dist.cTFD(t,distance, abbreviatedDistance[0],abbreviatedDistance[1],distancesSplitBy[1])// cuts the time for the distance
             newTime=pCalc.conv.time.sTM(newTime).split(":")// changes the new time to an array so i can change it
             m=newTime[0]// takes the first bit of the array to use
             s=newTime[1]// takes the second bit of the array to use
             const secondDistance=pCalc.calc.customs.singleCustom(distanceUnits[1],distancesSplitBy[1],newDistance,m,s)// gets the second splits
             allSplits.push(secondDistance) // adds the splits to all splits
             allSplits=allSplits.flat()// fixes the formatting
             return allSplits},// returns all the splits
         tripleCustom: function (distanceUnits,distancesSplitBy,distance,m,s){
             m=Number(m)// changes minutes to a number
             s=Number(s)//changes seconds to a number
             const abbreviatedDistance = []; // array for the abreviations
             for (let distanceUnit of distanceUnits) {const abbreviation = pCalc.conv.text.cT(distanceUnit);abbreviatedDistance.push(abbreviation);}// changes the long unit short and then adds it to an array
             let allSplits=[]// the array that stores everything
             const t=m*60+s// changes minutes and seconds to just seconds
             const firstDistance=pCalc.calc.customs.singleCustom(distanceUnits[0],distancesSplitBy[0],distance,m,s)// gets the splits for the first distance
             allSplits.push(firstDistance)// adds it to the all splits
             let newDistance=pCalc.conv.dist.cD(distance,abbreviatedDistance[0],abbreviatedDistance[1])// changes the distance
             let newTime=pCalc.conv.dist.cTFD(t,distance, abbreviatedDistance[0],abbreviatedDistance[1],distancesSplitBy[1])// cuts the time for the distance
             newTime=pCalc.conv.time.sTM(newTime).split(":")// changes the new time to an array so i can change it
             m=newTime[0]// takes the first bit of the array to use
             s=newTime[1]// takes the second bit of the array to use
             const secondDistance=pCalc.calc.customs.singleCustom(distanceUnits[1],distancesSplitBy[1],newDistance,m,s)// gets the second splits
             allSplits.push(secondDistance) // adds the splits to all splits
             newDistance=pCalc.conv.dist.cD(distance,abbreviatedDistance[0],abbreviatedDistance[2])// changes the distance
             newTime=pCalc.conv.dist.cTFD(t,distance, abbreviatedDistance[0],abbreviatedDistance[2],distancesSplitBy[2])// cuts the time for the distance
             newTime=pCalc.conv.time.sTM(newTime).split(":")// changes the new time to an array so i can change it
             m=newTime[0]// takes the first bit of the array to use
             s=newTime[1]// takes the second bit of the array to use
             const thirdDistance=pCalc.calc.customs.singleCustom(distanceUnits[2],distancesSplitBy[2],newDistance,m,s)// gets the second splits
             allSplits.push(thirdDistance) // adds the splits to all splits
             allSplits=allSplits.flat()// fixes the formatting
             return allSplits}}},// returns all the splits
 controls:{
     inputs:{
         sUI:{pUnitMeasurment:"mile", pUnitLength:1, pUnitSplit:1, minute:0, second:0,},//single unit inputs
         dUI:{ pUnitMeasurment:"mile", sUnitMeasurment:"mile", unitLength:1, pUnitSplit:1, sUnitSplit:1, minute:0, second:0,}, //double unit inputs
         tUI:{pUnitMeasurment:"mile", sUnitMeasurment:"mile", tUnitMeasurment:"mile", unitLength:1, pUnitSplit:1, sUnitSplit:1, tUnitSplit:1, minute:0, second:0,}, //triple unit inputs
         sHI:{minute:0,second:0},// sixteen hundred inputs
         tTHI:{minute:0,second:0},//thirty two hundred inputs
         fKI:{minute:0,second:0}},// five kilometer inputs
     outputs:{
         div_stuff: ["homeSelectionPage", "singleUnitInputPage", "doubleUnitInputPage","tripleUnitInputPage","fiveKilometerInputPage","sixteenHundredInputPage","thirtyTwoHundredInputPage","resultsPage"],
         badInput: function(){
             alert("one of your inputs are bad. make sure Unit splits and distances should only be up to the hundreths decimal place, the unit distance must be divisible by the unit split minutes and seconds must be less than 60, and the unit measurments are all different.")
         },
         hideAllFrames:function() {
             for (let i = 0; i < (pCalc.controls.outputs.div_stuff.length); i++) {   //loops through the divs
                 let x = document.getElementById(pCalc.controls.outputs.div_stuff[i]);//x is the div
                 x.style.display = "none";}},//hiding the div 
         showFrame: function(n){
             pCalc.controls.outputs.hideAllFrames(); //hids the frames
             let x = document.getElementById(pCalc.controls.outputs.div_stuff[n]);  //gets the div you want to show
             x.style.display = "block";},   // shows the div
         message: function(t){
             const x= document.getElementById("resultdiv")// gets the div
             x.innerHTML=t// changes the text divs
             pCalc.controls.outputs.showFrame(7)}},//shows the frame
     updateInputs:{// updates are used to turn each of the input values into their correct variable inputs
         updateSUI: function(){
             let x= document.getElementById("unitSelectSingle").value
             pCalc.controls.inputs.sUI.pUnitMeasurment= x
             x= document.getElementById("distanceSelectSingle").value
             pCalc.controls.inputs.sUI.pUnitLength= x
             x=document.getElementById("splitSelectSingle").value
             pCalc.controls.inputs.sUI.pUnitSplit=x
             x= document.getElementById("minuteSelectSingle").value
             pCalc.controls.inputs.sUI.minute= x
             x= document.getElementById("secondSelectSingle").value
             pCalc.controls.inputs.sUI.second= x},
         updateDUI: function(){
             let x= document.getElementById("primaryUnitSelectDouble").value
             pCalc.controls.inputs.dUI.pUnitMeasurment= x
             x=document.getElementById("secondaryUnitSelectDouble").value
             pCalc.controls.inputs.dUI.sUnitMeasurment= x
             x=document.getElementById("distanceSelectDouble").value
             pCalc.controls.inputs.dUI.unitLength= x
             x=document.getElementById("pDistanceSplitDouble").value
             pCalc.controls.inputs.dUI.pUnitSplit= x
             x=document.getElementById("sDistanceSplitDouble").value
             pCalc.controls.inputs.dUI.sUnitSplit= x
             x=document.getElementById("minuteSelectDouble").value
             pCalc.controls.inputs.dUI.minute= x
             x=document.getElementById("secondSelectDouble").value
             pCalc.controls.inputs.dUI.second= x},
         updateTUI: function(){
             let x= document.getElementById("primaryUnitSelectTriple").value
             pCalc.controls.inputs.tUI.pUnitMeasurment= x
             x=document.getElementById("secondaryUnitSelectTriple").value
             pCalc.controls.inputs.tUI.sUnitMeasurment= x
             x=document.getElementById("tertiaryUnitSelectTriple").value
             pCalc.controls.inputs.tUI.tUnitMeasurment= x
             x=document.getElementById("distanceSelectTriple").value
             pCalc.controls.inputs.tUI.unitLength= x
             x=document.getElementById("pDistanceSplitTriple").value
             pCalc.controls.inputs.tUI.pUnitSplit= x
             x=document.getElementById("sDistanceSplitTriple").value
             pCalc.controls.inputs.tUI.sUnitSplit= x
             x=document.getElementById("tDistanceSplitTriple").value
             pCalc.controls.inputs.tUI.tUnitSplit= x
             x=document.getElementById("minuteSelectTriple").value
             pCalc.controls.inputs.tUI.minute= x
             x=document.getElementById("secondSelectTriple").value
             pCalc.controls.inputs.tUI.second= x},
         updateSHI: function(){
             let x=document.getElementById("minuteSelectSixteenHundred").value
             pCalc.controls.inputs.sHI.minute= x
             x=document.getElementById("secondSelectSixteenHundred").value
             pCalc.controls.inputs.sHI.second= x},
         updateTTHI: function(){
             let x=document.getElementById("minuteSelectThirtyTwoHundred").value
             pCalc.controls.inputs.tTHI.minute= x
             x=document.getElementById("secondSelectThirtyTwoHundred").value
             pCalc.controls.inputs.tTHI.second= x},
         updateFKI: function(){
             let x=document.getElementById("minuteSelectFiveKilometer").value
             pCalc.controls.inputs.fKI.minute= x
             x=document.getElementById("secondSelectFiveKilometer").value
             pCalc.controls.inputs.fKI.second= x}},
     checkingInputs:{
         checkTime: function(m,s){
             m=Number(m)// tunrs into a number
             s=Number(s)// turns into a number
             if (m+s<1){return false;}// if at least m or s is 1
             if (!(m % 1 == 0)){return false;}// if minutes is a whole number
             if (!(s % 1 == 0)){return false;}// if seconds is a whole number
             if (0>m || m>=60){return false;}// if minutes is between 0 and60
             if (0>s||s>60){return false;}// if seconds is between 0 and 59
             return true;},// if all of those are true then return true
         checkLengthSplits: function (l,s1){
             l=Number(l)// turns l to a number
             s1=Number(s1)// turns s1 to a number
             if (l<0.01){return false;}// makes sure the number is big enough
             if (s1<0.01){return false;}// makes sure the number is big enough
             if (l<s1){return false;}// makes sure the length is bigger than the splits
             if (!((l*100) % 1 == 0)){return false;}// makes sure the number is only to 0.01 decimal
             if (!((s1*100) % 1 == 0)){return false;}//makes sure the number is only to 0.01 decimal
             if (!((l*100) % (s1*100)==0)){return false;}     // makes sure that the length is divisible by the split
             return true},// if all of those pass return true
         checkOtherSplits: function(s){
             s=Number(s)// changes s to a number
             if (s<0.01){return false;}// makes sure its big enough
             if (!((s*100) % 1 == 0)){return false;}// make sure the smallest decimal place is 0.01
             return true;}},// if both are true, return true
     steps:{
         // used to do the entire calculation, for all of these, it first gets the inputs of the user to update into the inputs, then it assigns a letter to each aspect of the inputs. then it checks the inputs. if the inputs pass the check, it calculates it using the function. then it stores the data in r. then r is mapped for outputs. then it is used with outputs.message to display it on the result div
         suiSteps: function(){// single unit steps
             pCalc.controls.updateInputs.updateSUI()
             const a=pCalc.controls.inputs.sUI.pUnitMeasurment
             const b=pCalc.controls.inputs.sUI.pUnitSplit
             const c=pCalc.controls.inputs.sUI.pUnitLength
             const d=pCalc.controls.inputs.sUI.minute
             const e=pCalc.controls.inputs.sUI.second
             let check= true
             if (!(pCalc.controls.checkingInputs.checkLengthSplits(c,b))){check=false}
             if (!(pCalc.controls.checkingInputs.checkTime(d,e))){check=false}
             if (check){
                 let r= pCalc.calc.customs.singleCustom(a,b,c,d,e)
                 r= r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
         duiSteps: function(){// double unit steps
             pCalc.controls.updateInputs.updateDUI()
             const a=pCalc.controls.inputs.dUI.pUnitMeasurment
             const b=pCalc.controls.inputs.dUI.sUnitMeasurment
             const c=pCalc.controls.inputs.dUI.pUnitSplit
             const d=pCalc.controls.inputs.dUI.sUnitSplit
             const e=pCalc.controls.inputs.dUI.unitLength
             const f=pCalc.controls.inputs.dUI.minute
             const g=pCalc.controls.inputs.dUI.second
             let check=true
             if (a==b){check=false;}
             if (!(pCalc.controls.checkingInputs.checkLengthSplits(e,c))){check=false}
             if (!(pCalc.controls.checkingInputs.checkOtherSplits(d))){check=false}
             if (!(pCalc.controls.checkingInputs.checkTime(f,g))){check=false}
             if (check){
                 let r= pCalc.calc.customs.doubleCustom([a,b],[c,d],e,f,g)
                 r= r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
                                 
         tuiSteps: function(){// triple unit steps
             pCalc.controls.updateInputs.updateTUI()
             const a=pCalc.controls.inputs.tUI.pUnitMeasurment
             const b=pCalc.controls.inputs.tUI.sUnitMeasurment
             const c=pCalc.controls.inputs.tUI.tUnitMeasurment
             const d=pCalc.controls.inputs.tUI.pUnitSplit
             const e=pCalc.controls.inputs.tUI.sUnitSplit
             const f=pCalc.controls.inputs.tUI.tUnitSplit
             const g=pCalc.controls.inputs.tUI.unitLength
             const h=pCalc.controls.inputs.tUI.minute
             const i=pCalc.controls.inputs.tUI.second
             let check=true
             if (a==b || a==c || b==c){check=false}
             if (!(pCalc.controls.checkingInputs.checkLengthSplits(g,d))){check=false}
             if (!(pCalc.controls.checkingInputs.checkOtherSplits(e))){check=false}
             if (!(pCalc.controls.checkingInputs.checkOtherSplits(f))){check=false}
             if (!(pCalc.controls.checkingInputs.checkTime(h,i))){check=false}
             if (check){
                 let r= pCalc.calc.customs.tripleCustom([a,b,c],[d,e,f],g,h,i)
                 r= r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
         shiSteps: function(){// sixteen hundred steps
             pCalc.controls.updateInputs.updateSHI()
             const a=pCalc.controls.inputs.sHI.minute
             const b=pCalc.controls.inputs.sHI.second
             if (pCalc.controls.checkingInputs.checkTime(a,b)){
                 let r= pCalc.calc.presets.sixteenHundred(a,b)
                 r= r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
         tthiSteps: function(){// thirty two hundred steps
             pCalc.controls.updateInputs.updateTTHI()
             const a=pCalc.controls.inputs.tTHI.minute
             const b=pCalc.controls.inputs.tTHI.second
             if (pCalc.controls.checkingInputs.checkTime(a,b)){
                 let r= pCalc.calc.presets.thirtyTwoHundred(a,b)
                 r=r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
         fkiSteps: function(){// five kimometer steps
             pCalc.controls.updateInputs.updateFKI()
             const a=pCalc.controls.inputs.fKI.minute
             const b=pCalc.controls.inputs.fKI.second
             if (pCalc.controls.checkingInputs.checkTime(a,b)){
                 let r= pCalc.calc.presets.fiveKilometer(a,b)
                 r= r.map(item => `<p>${item}</p>`).join('');
                 pCalc.controls.outputs.message(r)}else{pCalc.controls.outputs.badInput()}},
                 }}}
