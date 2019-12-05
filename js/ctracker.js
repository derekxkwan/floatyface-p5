//import pModel from '../lib/model_pca_20_svm.js';

let lefteye = [27, 23, 63, 24, 64, 25, 65, 26, 66];
let righteye = [32, 30, 68, 29, 67, 28, 70, 31, 69];
let innermouth = [44, 61, 60, 59, 50, 58, 57, 56];

function load_cam()
{
    let mv, vipt;
    vipt = createCapture(VIDEO);
    vipt.size(400,300);
    vipt.position(0,0);
    vipt.id("v");
    mv = document.getElementById("v");
    mv.muted = true;
    console.log("cam");

    return vipt;
    
}

function load_tracker(vipt)
{
    let ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.setResponseMode("cycle",["raw"]);
    ctracker.start(vipt.elt);
    console.log("tracker");
    return ctracker;
}

function get_pos(ctracker)
{
   return  ctracker.getCurrentPosition();
}

function load_canvas(w,h)
{
    let cnv = createCanvas(w,h);
    cnv.position(0,0);
    console.log("cnv");
    return cnv;
}

function sqdist(p1, p2)
{
    if(!(isNaN(p1[0]) || isNaN(p1[1]) || isNaN(p2[0]) || isNaN(p2[1])))
	return (p1[1] - p2[1])**2 + (p1[0] - p2[0])**2;
    else return 0;
}



function mouthdist(pos, moutharr)
{
    //let dist1 = sqdist(pos[moutharr[2]], pos[moutharr[3]]);
    let dist2 = sqdist(pos[moutharr[4]], pos[moutharr[5]]);
    //let dist3 = sqdist(pos[moutharr[6]], pos[moutharr[7]]);
    //let totaldist = dist1 +dist2 + dist3;
    let totaldist = dist2;
    return totaldist;
}
