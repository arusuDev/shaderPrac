const vec3 lightDir = vec3(-0.6,0.6,-2.6);
const float pi = acos(-1.0);
const float pi2 = pi*2.;

//回転行列
mat2 rot(float a){
    float c = cos(a),s = sin(a);
    return mat2(c,s,-s,c);
}
//polar mod
vec2 pmod(vec2 p,float r){
    float a = atan(p.x,p.y) + pi/r;
    float n = pi2 / r;
    a = floor(a/n)*n; //小数点以下を切り捨てて整数部のみ取り出す関数
    return p*rot(-a);
}
//折りたたみ
vec3 foldX(vec3 p){
    p.x = abs(p.x);
    return p;
}

//繰り返し
vec3 repeat(vec3 p){
    return mod(p,6.0)-3.;
}
vec3 repeatX(vec3 p){
    p.x = mod(p.x,8.)-4.0;
    return p;
}

//形状の定義
float sdSphere(vec3 p,float r){
    float d = length(p) - r;
    return d;
}

float sdBox2(vec3 p,float s){
    p = abs(p)-s;
    return max(p.z,max(p.x,p.y));
}

float sdBox(vec3 p,float s){
    p = abs(repeat(vec3(pmod(vec2(p.x,p.y),6.0),p.z)))-s;
    
    return max(p.z,max(p.x,p.y));
}

float sdPlane(vec3 p){
    float d = p.x;
    return d;
}

vec3 hsv(float h,float s,float v){
    return ((clamp(ans(fract(h+vec3(0,2,1)/3.)*10.-2)-1.,0.,1.)-1.)*s+1.)*v;
}

float distanceFunction(vec3 pos){
    //IFS
    float d = 1e7;
    for(int i=0;i<5;i++){
        pos = abs(pos) - 1.;
        pos.xz *= rot(iTime*1.);
        pos.xy *= rot(iTime*1.);
    }
    d = min(d,sdBox2(pos,0.4));         
    return d;
}

//法線の算出
vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunction(p+vec3(d,0.0,0.0)) - distanceFunction(p+vec3(-d,0.0,0.0)),
        distanceFunction(p+vec3(0.0,d,0.0)) - distanceFunction(p+vec3(0.0,-d,0.0)),
        distanceFunction(p+vec3(0.0,0.0,d)) - distanceFunction(p+vec3(0.0,0.0,-d))
    ));
}


void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / min (iResolution.x,iResolution.y);

    //raymarching
    //カメラの位置の定義
    vec3 cameraPos = vec3(0.,0.,-25.);
    //スクリーンまでの距離をここで定義
    float screenZ = 2.5;
    //自分自身のpixelとスクリーンの距離をvec3とし、0-1の範囲で正規化
    vec3 rayDirection = normalize(vec3(uv,screenZ));

    float depth = 0.0;
    vec3 color = vec3(0.0);

    for(int i=0;i<100;i++){
        vec3 rayPos = cameraPos + rayDirection * depth;
        float dist = distanceFunction(rayPos);

        if(dist < 0.0001){
            vec3 normal = getNormal(rayPos);
            float diff = clamp(dot(normal,lightDir),0.1,1.0);
            color = vec3(diff)*vec3(0.0,0.5,1.)+vec3(0.3);
            break;
        }
        depth += dist;
    }
    fragColor = vec4(color,1.);
}