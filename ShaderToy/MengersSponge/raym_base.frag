const vec3 lightDir = vec3(-0.6,0.6,-2.6);
const float pi = acos(-1.0);
const float pi2 = pi*2.;

float distanceFunction(vec3 pos){
    //ここに距離関数を定義する。
    return 1.0;
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