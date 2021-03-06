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
//与えられた点pとv2からv1を引き、正規化したv2とpの内積を取る。
//内積が負の値である、ということはΘ=90~270の範囲であることであるため、
//v1からの距離を返せばよい。
//次に内積のサイズが、線分の長さを超えている場合、これはv2の位置を超えていないと起こりえない。
//よってpからvを引いた値の距離を測ればよい。
//最後に余ったものは、pから線分に垂線を下した場合に直行すると考えられるため、
//
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

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //原点を中心に持ってきながら、正規化する。-1.0~1.0の範囲。
    vec2 uv = (2.0*fragCoord.xy - iResolution.xy) / min(iResolution.x,iResolution.y);
    fragColor = vec4(vec3(line(uv,vec2(0.0,0.0),vec2(1.0,1.0))),1.0);
}