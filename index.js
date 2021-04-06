$(document).ready(function(){
    $('#indexchart').hide();
});
function submit(){

    //数组初始化
    //输入校验
    if(workbook1==null||workbook2==null){
        alert("信息输入不完全");
        return;
    }
    //workbook1======================
    var wb1=workbook1['Sheets'];
    var wb1s=wb1['Sheet1'];
    var sheetdata1=wb1s['!ref'];
    // console.log(sheetdata1);
    //组长表基本数据的获取
    var sd101=sheetdata1.split(":");
    var sd10101=sd101[1];
    sd10101=sd10101.split("");
    st1max=sd10101[1]+sd10101[2];
    
    // console.log(st1max);
    for (let i = 0; i < st1max; i++) {
        var e=wb1s['B'+(i+1)];
        var e1=e['v'];
        mastergroup[i]=e1;
    }
    mastergroup['count']=st1max;
    // console.log(mastergroup);
    //workbook2========================================
    var wb2=workbook2['Sheets'];
    var wb2s=wb2['Sheet1'];
    var sheetdata2=wb2s['!ref'];
    // console.log(sheetdata2);
    //表格基本数据的获取
    var sd201=sheetdata2.split(":");
    var sd20101=sd201[1];
    console.log(sd20101);
    // var sd2010101=sd20101.split("");
    
    // var st2maxcol=sd2010101[0]+sd2010101[1];
    // console.log(sd2010101);
    var st2maxcol0=sd20101.match(/(\d+(\.\d+)?)/);
    st2maxcol=st2maxcol0[0];//列数
    console.log(st2maxcol);
    st2maxrow=sd20101[0];
    st2maxrow=alphaorder(st2maxrow);//行数
    /*
    提取过程中 gD6pF5=>讲桌
    qA4sD1=>空地 
    */
    //先竖后横
    //    console.log(parseInt(st2maxcol)+1);
    //    console.log(wb2s);
   var maxgroup;
   for (let i = 1; i <parseInt(st2maxrow)+1; i++) {
    var row=anti_alphaorder(i);
    // console.log(row);
    prep[i]={};
    for (let j =1; j <parseInt(st2maxcol)+1; j++) {
        var col=j;
        // console.log(row+col);
        var inf =wb2s[row+col];
        var inf1=inf['v'];
        var sh=inf1.indexOf('aCaHaE');
        if(sh[0]!=null||sh[0]!=NaN){
            var s= inf1.match(/(\d+(\.\d+)?)/);
            if(maxgroup==null||maxgroup==NaN){
                maxgroup=s[0];
            }
            else{
                if(parseInt(s[0])>=maxgroup){
                    maxgroup=s[0];
                }
            }
        }
        prep[i][j]=inf1;
    } 
   }
   //两表的匹配校验
   if(maxgroup!=st1max){
       alert('These two charts does not match at all!');
       return;
   }
   console.log(prep);
   console.log(maxgroup);
//    console.log(parseInt(st2maxcol)+1);
   //==================================================
   //视图生成==========================================
   //outer
   for (let k = 0; k <parseInt(st2maxcol)+1; k++) {
       //多一次来生成讲桌那一列
        if(k==0){
            var e= document.createElement('tr');
            e.setAttribute('id','row'+k);
            $('#re1').after(e);
            for (let l = 1; l < parseInt(st2maxrow)+1; l++) {
                var mid = Math.round(parseInt(st2maxrow)/2);
                var f=document.createElement('td');
                if(l==mid)f.innerText='讲台';
                else if(l==parseInt(st2maxrow))f.innerText='门';
                else f.innerHTML='&nbsp;'
                f.setAttribute('id','0'+';'+l);
                $('#row'+k).append(f);
                
            }
        }
        else{
            var e= document.createElement('tr');
            e.setAttribute('id','row'+k);
            $('#row'+(k-1)).after(e);
            for (let l = 1; l < parseInt(st2maxrow)+1; l++) {
                
                var f=document.createElement('td');
                f.setAttribute('id',k+';'+l);
                f.innerHTML='&nbsp;'
                $('#row'+k).append(f);
                
            }

        }
       
   }
   //inner
   //随机数据的选用
   //随机数组
   var rad={};
   for (let m = 0; m < st1max; m++) {
        rad[m]={};
        rad[m][0]=m;
        rad[m][1]=Math.random();
   }
   //排序
   var reslt = obsort(rad);
   var color ={};
   var group={};
//    console.log(parseInt(st2maxrow)+1,parseInt(st2maxrow));
   //填入表二格式 此处另起一循环是因为编者脑力不够了。。。
   for (let k = 1; k <parseInt(st2maxrow)+1; k++) {
        //拆包1
        var n=prep[k];
        for (let l = 0; l < parseInt(st2maxcol)+1; l++) {
            //多一次来跳过讲桌那一列
            if (l!=0) {
                var o = n[l];
                // console.log(k,l,prep[l][k],o);
                if(prep[k][l]=='qA4sD1'){
                    document.getElementById(l+';'+k).style.backgroundColor='aliceblue';
                }
                else if (prep[k][l]=='dL2bB2') {
                    //固定 building...
                }
                else{
                    var p =parseInt(o.match(/(\d+(\.\d+)?)/));
                    if (color[p]==null||color[p]==NaN) {
                        color[p]={};
                        var r =randomNum(1,254);
                        var g =randomNum(1,254);
                        var b =randomNum(1,254);
                        color[p]['r']=r;
                        color[p]['g']=g;
                        color[p]['b']=b;
                        document.getElementById(l+';'+k).style.backgroundColor='rgba('+r+','+g+','+b+',0.541)';
                    }
                    else{
                        document.getElementById(l+';'+k).style.backgroundColor='rgba('+color[p]['r']+','+color[p]['g']+','+color[p]['b']+',0.541)';
                    }
                    if (group[p]==null||group[p]==NaN) {
                        group[p]=[];
                        group[p][0]=l+';'+k;
                    } else {
                        var q =group[p].length;
                        group[p][q]=l+';'+k;
                    }
                }
            }

        }
    }
    console.log(color,group,reslt,mastergroup);
    //写入组名
    var s =Object.keys(reslt);
    s=s.length;
    for (let r = 1; r < s+1; r++) {
        var groupnum=parseInt(reslt[r-1][0]);
        var name =mastergroup[groupnum-1];
        var v =group[r].length;
        // console.log(groupnum,name,group[groupnum]);
        for (let w = 1; w < v+1; w++) {
            console.log(group[r][w-1],r,w);
            document.getElementById(group[r][w-1]).innerHTML='&nbsp;'+name+'';
            
        }
    }
    
    $('#indexcard').hide();
   $('#indexchart').show();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function again (){
    alert('Are you sure?')
    var rad={};
   for (let m = 0; m < st1max; m++) {
        rad[m]={};
        rad[m][0]=m;
        rad[m][1]=Math.random();
   }
   //排序
   var reslt = obsort(rad);
   var color ={};
   var group={};
//    console.log(parseInt(st2maxrow)+1,parseInt(st2maxrow));
   //填入表二格式 此处另起一循环是因为编者脑力不够了。。。
   for (let k = 1; k <parseInt(st2maxrow)+1; k++) {
        //拆包1
        var n=prep[k];
        for (let l = 0; l < parseInt(st2maxcol)+1; l++) {
            //多一次来跳过讲桌那一列
            if (l!=0) {
                var o = n[l];
                // console.log(k,l,prep[l][k],o);
                if(prep[k][l]=='qA4sD1'){
                    document.getElementById(l+';'+k).style.backgroundColor='aliceblue';
                }
                else if (prep[k][l]=='dL2bB2') {
                    //固定 building...
                }
                else{
                    var p =parseInt(o.match(/(\d+(\.\d+)?)/));
                    if (color[p]==null||color[p]==NaN) {
                        color[p]={};
                        var r =randomNum(1,254);
                        var g =randomNum(1,254);
                        var b =randomNum(1,254);
                        color[p]['r']=r;
                        color[p]['g']=g;
                        color[p]['b']=b;
                        document.getElementById(l+';'+k).style.backgroundColor='rgba('+r+','+g+','+b+',0.541)';
                    }
                    else{
                        document.getElementById(l+';'+k).style.backgroundColor='rgba('+color[p]['r']+','+color[p]['g']+','+color[p]['b']+',0.541)';
                    }
                    if (group[p]==null||group[p]==NaN) {
                        group[p]=[];
                        group[p][0]=l+';'+k;
                    } else {
                        var q =group[p].length;
                        group[p][q]=l+';'+k;
                    }
                }
            }

        }
    }
    console.log(color,group,reslt,mastergroup);
    //写入组名
    var s =Object.keys(reslt);
    s=s.length;
    for (let r = 1; r < s+1; r++) {
        var groupnum=parseInt(reslt[r-1][0]);
        var name =mastergroup[groupnum-1];
        var v =group[r].length;
        // console.log(groupnum,name,group[groupnum]);
        for (let w = 1; w < v+1; w++) {
            console.log(group[r][w-1],r,w);
            document.getElementById(group[r][w-1]).innerHTML='&nbsp;'+name+'';
            
        }
    }
    
    $('#indexcard').hide();
   $('#indexchart').show();
}
// 对象排序函数
/*
    要求输入为对象，且对象为如此形式：
    0:
        0: 0
        1: 0.28128382240083516
        __proto__: Object
    1:
        0: 1
        1: 0.18976095886966649
        __proto__: Object
    2:
        0: 2
        1: 0.866073208455183
        __proto__: Object
    3:
        0: 3
        1: 0.9790868868728022
        __proto__: Object
 */
function obsort(obj){
    var a =Object.keys(obj);
    a =a.length;
    var b =[];
    for (let c = 0; c < a; c++) {
        b[c]=obj[c][1];
    }
    var d =b.sort();
    // console.log(d,obj);
    var h=obj;
    for (let e = 0; e < a; e++) {
        var f=d[e];
        // console.log(f);
        for (let g = 0; g < a; g++) {
            // console.log(obj[g][1]);
            // console.error(g);
            if (f==obj[g][1]) {
                // console.log(h[g][0],g+1);
                h[g][0]=e+1;
                break;
            }                    
        }
    }
    return h;
}
// 找出字母在字母表中的位置，由0开始
function alphaorder(str){
    e=str.toUpperCase();
    var e= e.charCodeAt(0);
    return e-64;
}

function anti_alphaorder(str){
    str=parseInt(str);
    str=64+str;
    var e=String.fromCharCode(str);
    e=e.toUpperCase();
    return e;
}
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        // break;
      case 2:
        return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
        // break;
      default:
        return 0;
        // break;
    }
  } 