#define PI 3.1415926535
#define INF 1e10

float circle(vec2 p,float r){
    return length(p)-r;
}

vec3 calc(vec2 p){
    float d = circle(p,0.4);
    return vec3(pow(clamp(1.0-d,0.0,1.0),5.0));
}

float crs(vec2 v1,vec2 v2){
    return v1.x * v2.y - v1.y * v2.x;
}

//2点 v1,v2を端点にもつ線分との距離を返す。
float line(vec2 p,vec2 v1,vec2 v2){
    p -= v1;
    vec2 v=v2-v1;
    float t = dot(p,normalize(v));
    if(t<0.0){
        return length(p);
    }else if(t>length(v)){
        return length(p-v);
    }else{
        return abs(crs(p,normalize(v)));
    }
}

float pentagram(vec2 p,float r){
    float d = INF;
    for(int i=0;i<5;i++){
        float rad1 = 2.0*PI*float(i)/5.0;
        float rad2 = 2.0*PI*float(i+2)/5.0;
        vec2 v1 = vec2(cos(rad1),sin(rad1))*r;
        vec2 v2 = vec2(cos(rad2),sin(rad2))*r;
        d = min(d,line(p,v1,v2)); // dと比較して、小さいほうを取ることで図形の合成。
    }
    return d;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //原点を中心に持ってきながら、正規化する。-1.0~1.0の範囲。
    vec2 uv = (2.0*fragCoord.xy - iResolution.xy) / min(iResolution.x,iResolution.y);
    fragColor = vec4(vec3(1.0-pow(pentagram(uv,1.0),0.1)),1.0);
}