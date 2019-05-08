
//From : https://wgld.org/d/glsl/g009.html

const float sphereSize = 2.5;
const int loop_num = 16;

float distanceFunc(vec3 p){
    return length(p) - sphereSize;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //fragment position
    vec2 p = (fragCoord.xy * 2.0- iResolution.xy) / min(iResolution.x,iResolution.y);
    
    vec3 cPos = vec3(0.0,0.0,3.0);  //カメラの位置
    vec3 cDir = vec3(0.0,0.0,-1.0); //奥向き
    vec3 cUp = vec3(0.0,1.0,0.0);   //上向き
    vec3 cSide = cross(cDir,cUp);   //横向き(外積)
    float targetDepth = 0.1;        //深度

    //Ray
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);//正規化で0~1へ

    //marching loop
    float distance  = 0.0;
    float rLen      = 0.0;
    vec3 rPos   = cPos;

    for (int i=0;i<loop_num;i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
        if(abs(distance) < 0.001){
            break;
        }
    }
    if(abs(distance) < 0.001){
        fragColor = vec4(vec3(1.0),1.0);
    }else{
        fragColor = vec4(vec3(0.0),1.0);
    }

}