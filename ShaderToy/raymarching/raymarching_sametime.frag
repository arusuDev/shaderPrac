
//From : https://wgld.org/d/glsl/g009.html

const float sphereSize = 1.;
const int loop_num = 16;
const vec3 lightDir = vec3(-0.577,0.577,0.577);

const float PI = 3.14159265;
const float angle = 60.0;
//field of view
const float fov = angle * 0.5 * PI / 180.0;
vec3 cPos = vec3(0.0,0.0,3.0);

float distFuncTours(vec3 p){
    //第一引数がトーラスの中心部の円
    //第二引数がトーラスの半径
    vec2 t = vec2(0.75,0.05);
    vec2 r = vec2(length(p.xy)-t.x,p.z);
    return length(r)-t.y;
}

float distFuncFloor(vec3 p){
    //面法線を与えることによって、内積を取ることで床を描画する。
    vec3 floor_Normal = vec3(0.0,1.0,0.0);
    return dot(p,floor_Normal) + 1.0;
}

float distanceFunc(vec3 p){
    //２つ参照したい（同時に描画したい場合）は、距離関数の小さい方をとればよい
    float d1 = distFuncTours(p);
    float d2 = distFuncFloor(p);
    return min(d1,d2);
}

//rayとオブジェクトの交点の座標を受け取る。
vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        //勾配の計算を行っている。各軸に対してどの程度の傾きなのかを算出。
        distanceFunc(p + vec3(d,0.0,0.0)) - distanceFunc(p + vec3(-d,0.0,0.0)),
        distanceFunc(p + vec3(0.0,d,0.0)) - distanceFunc(p + vec3(0.0,-d,0.0)),
        distanceFunc(p + vec3(0.0,0.0,d)) - distanceFunc(p + vec3(0.0,0.0,-d))
    ));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //fragment position
    vec2 p = (fragCoord.xy * 2.0- iResolution.xy) / min(iResolution.x,iResolution.y);
    //Ray
    vec3 ray = normalize(vec3(sin(fov) * p.x ,sin(fov)* p.y ,-cos(fov)));//正規化で0~1へ

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
        //衝突している場合
        vec3 normal = getNormal(rPos);
        //並行光源との内積をとり0.1~1.0でclampする。
        float diff = clamp(dot(lightDir,normal),0.1,1.0);
        fragColor = vec4(vec3(diff),1.0);
    }else{
        fragColor = vec4(vec3(0.0),1.0);
    }
}