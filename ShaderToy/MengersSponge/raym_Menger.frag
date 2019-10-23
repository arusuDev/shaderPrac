const vec3 lightDir = vec3(-0.6,0.6,-2.6);
const float pi = acos(-1.0);
const float pi2 = pi*2.;
float sphereSize = 0.8;

//メンガーのスポンジ(https://gam0022.net/blog/2019/06/25/unity-raymarching/)
float dMenger(vec3 z0,vec3 offset,float scale){
    vec4 z = vec4(z0,1.0);
    for (int n = 0; n < 4; n++) {
        z = abs(z);

        if (z.x < z.y) z.xy = z.yx;
        if (z.x < z.z) z.xz = z.zx;
        if (z.y < z.z) z.yz = z.zy;

        z *= scale;
        z.xyz -= offset * (scale - 1.0);

        if (z.z < -0.5 * offset.z * (scale - 1.0))
            z.z += offset.z * (scale - 1.0);
    }
    return (length(max(abs(z.xyz) - vec3(1.0,1.0,1.0),0.0)) - 0.05)/z.w;
}
mat2x2 rotate(in float a){
    float s = sin(a),c = cos(a);
    return mat2x2(c,s,-s,c);
}

vec2 foldRotate(in vec2 p,in float s){
    float a = pi/s - atan(p.x,p.y);
    float n = pi2/s;
    a = floor(a/n) * n;
    p = rotate(a)*p;
    return p;
}
float sdcircle(vec3 pos){
    return length(pos) - sphereSize;
}
float distanceFunction(vec3 pos){
    //ここに距離関数を定義する。
    pos.xy = foldRotate(pos.yx,2.);
    //return dMenger(pos,vec3(0.8),0.8);
    return sdcircle(pos);
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