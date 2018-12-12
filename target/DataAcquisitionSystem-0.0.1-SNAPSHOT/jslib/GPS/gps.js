var GPS={PI:3.141592653589793,x_pi:3.141592653589793*3000/180,delta:function(lat,lon){var a=6378245;var ee=0.006693421622965943;var dLat=this.transformLat(lon-105,lat-35);var dLon=this.transformLon(lon-105,lat-35);var radLat=lat/180*this.PI;var magic=Math.sin(radLat);magic=1-ee*magic*magic;var sqrtMagic=Math.sqrt(magic);dLat=(dLat*180)/((a*(1-ee))/(magic*sqrtMagic)*this.PI);dLon=(dLon*180)/(a/sqrtMagic*Math.cos(radLat)*this.PI);return{"lat":dLat,"lon":dLon}},gcj_encrypt:function(wgsLat,wgsLon){if(this.outOfChina(wgsLat,wgsLon)){return{"lat":wgsLat,"lon":wgsLon}}var d=this.delta(wgsLat,wgsLon);return{"lat":wgsLat+d.lat,"lon":wgsLon+d.lon}},gcj_decrypt:function(gcjLat,gcjLon){if(this.outOfChina(gcjLat,gcjLon)){return{"lat":gcjLat,"lon":gcjLon}}var d=this.delta(gcjLat,gcjLon);return{"lat":gcjLat-d.lat,"lon":gcjLon-d.lon}},gcj_decrypt_exact:function(gcjLat,gcjLon){var initDelta=0.01;var threshold=1e-9;var dLat=initDelta,dLon=initDelta;var mLat=gcjLat-dLat,mLon=gcjLon-dLon;var pLat=gcjLat+dLat,pLon=gcjLon+dLon;var wgsLat,wgsLon,i=0;while(1){wgsLat=(mLat+pLat)/2;wgsLon=(mLon+pLon)/2;var tmp=this.gcj_encrypt(wgsLat,wgsLon);dLat=tmp.lat-gcjLat;dLon=tmp.lon-gcjLon;if((Math.abs(dLat)<threshold)&&(Math.abs(dLon)<threshold)){break}if(dLat>0){pLat=wgsLat}else{mLat=wgsLat}if(dLon>0){pLon=wgsLon}else{mLon=wgsLon}if(++i>10000){break}}return{"lat":wgsLat,"lon":wgsLon}},bd_encrypt:function(gcjLat,gcjLon){var x=gcjLon,y=gcjLat;var z=Math.sqrt(x*x+y*y)+0.00002*Math.sin(y*this.x_pi);var theta=Math.atan2(y,x)+0.000003*Math.cos(x*this.x_pi);bdLon=z*Math.cos(theta)+0.0065;bdLat=z*Math.sin(theta)+0.006;return{"lat":bdLat,"lon":bdLon}},bd_decrypt:function(bdLat,bdLon){var x=bdLon-0.0065,y=bdLat-0.006;var z=Math.sqrt(x*x+y*y)-0.00002*Math.sin(y*this.x_pi);var theta=Math.atan2(y,x)-0.000003*Math.cos(x*this.x_pi);var gcjLon=z*Math.cos(theta);var gcjLat=z*Math.sin(theta);return{"lat":gcjLat,"lon":gcjLon}},mercator_encrypt:function(wgsLat,wgsLon){var x=wgsLon*20037508.34/180;var y=Math.log(Math.tan((90+wgsLat)*this.PI/360))/(this.PI/180);y=y*20037508.34/180;return{"lat":y,"lon":x}},mercator_decrypt:function(mercatorLat,mercatorLon){var x=mercatorLon/20037508.34*180;var y=mercatorLat/20037508.34*180;y=180/this.PI*(2*Math.atan(Math.exp(y*this.PI/180))-this.PI/2);return{"lat":y,"lon":x}},distance:function(latA,lonA,latB,lonB){var earthR=6371000;var x=Math.cos(latA*this.PI/180)*Math.cos(latB*this.PI/180)*Math.cos((lonA-lonB)*this.PI/180);var y=Math.sin(latA*this.PI/180)*Math.sin(latB*this.PI/180);var s=x+y;if(s>1){s=1}if(s<-1){s=-1}var alpha=Math.acos(s);var distance=alpha*earthR;return distance},outOfChina:function(lat,lon){if(lon<72.004||lon>137.8347){return true}if(lat<0.8293||lat>55.8271){return true}return false},transformLat:function(x,y){var ret=-100+2*x+3*y+0.2*y*y+0.1*x*y+0.2*Math.sqrt(Math.abs(x));ret+=(20*Math.sin(6*x*this.PI)+20*Math.sin(2*x*this.PI))*2/3;ret+=(20*Math.sin(y*this.PI)+40*Math.sin(y/3*this.PI))*2/3;ret+=(160*Math.sin(y/12*this.PI)+320*Math.sin(y*this.PI/30))*2/3;return ret},transformLon:function(x,y){var ret=300+x+2*y+0.1*x*x+0.1*x*y+0.1*Math.sqrt(Math.abs(x));ret+=(20*Math.sin(6*x*this.PI)+20*Math.sin(2*x*this.PI))*2/3;ret+=(20*Math.sin(x*this.PI)+40*Math.sin(x/3*this.PI))*2/3;ret+=(150*Math.sin(x/12*this.PI)+300*Math.sin(x/30*this.PI))*2/3;return ret}};