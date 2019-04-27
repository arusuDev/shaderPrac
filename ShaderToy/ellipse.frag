float circle(vec2 p,float r){
    return length(p)-r;
}
//中心vec2 pで、r.x,r.yをそれぞれの軸の半径とする楕円になる。
float ellipse(vec2 p,vec2 r){
    return (length(p/r)-1.0)*min(r.x,r.y);
}

vec3 calc(vec2 p){
    float d = ellipse(p,vec2(0.7,0.3));
    return vec3(pow(clamp(1.0-d,0.0,1.0),5.0));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //原点を中心に持ってきながら、正規化する。-1.0~1.0の範囲。
    vec2 uv = (2.0*fragCoord.xy - iResolution.xy) / min(iResolution.x,iResolution.y);
    fragColor = vec4(calc(uv),1.0);
}