#define S(a,b,t) smoothstep(a,b,t)
float DistLine(vec2 p , vec2 a , vec2 b){
    vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
    return length(pa - ba*t);
}

float N21(vec2 p){
    p = fract(p*vec2(233.34,829.12));
    p += dot(p,p+36.26);
    return fract(p.x * p.y);
}

vec2 N22(vec2 p){
    float n = N21(p);
    return vec2(n,N21(n+p));
}

mat2 rot(vec2 p,float r){
    return mat2(sin(r),cos(r),-cos(r),sin(r));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv = (fragCoord*2. - iResolution.xy)/iResolution.y;
    uv.x += iTime*0.4;
    uv.y += iTime*0.4;
    float d = DistLine(uv,vec2(0),vec2(1));
    float m = S(.1,.05,d);
    uv.x *= 3.;   
    uv.y *= 3.;
    vec2 gv = fract(uv);
    uv *= rot(gv,0.5);
    vec3 col;
    float sl = DistLine(fract(uv),vec2(0.0,fract(iTime)),vec2(1.0,fract(iTime)));
    float sm = S(0.1,0.00,sl);
    //float sm = S(.05,.04,sl);
    vec3 overlayColor = vec3(0.6,0.6,1.);

    if(gv.x > .9 || gv.y > .9){
        col = vec3(0.0,0.0,0.4);
    }else{
        col = vec3(0);
    }
    if(gv.x > 0.9 || gv.y > .9){
        col += vec3(sm)*overlayColor;
    }
    fragColor = vec4(col,1.0);
}