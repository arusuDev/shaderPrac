#ifdef GL_ES
precision mediump float
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.141592653589793;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle),-sin(_angle),
				sin(_angle),cos(_angle));
}

float plot(vec2 st,float pct){
	return smoothstep(pct-0.02,pct,st.y)-smoothstep(pct,pct+0.02,st.y);
}

float rand(vec2 st){
	return fract(sin(dot(st,vec2(12.9379,74.8371)))*42729.6382);
}

float box_size(vec2 st,float n){
	st = (floor(st*n)+0.5)/n;
	float offs = rand(st) * 5.;
	return (1.+sin(u_time*3.+offs))*0.5;
}

float wave(vec2 st,float n){
	st = (floor(st*n)+0.5)/n;
	float d = distance(vec2(0.5,.5),st);
	return (1. + sin(d*3. - u_time*3.)) * 0.5;
}

float box(vec2 st,float size){
	size = 0.5 + size * .5;
	st = step(st,vec2(size)) * step(1.0-st,vec2(size));
	return st.x * st.y;
}

float box_wave(vec2 uv,float n){
	vec2 st = fract(uv*n);
	float size = wave(uv,n);
	return box(st,size);
}

void main(){
	float n = 10.;
	vec2 uv = gl_FragCoord.xy/u_resolution;
	uv = uv * rotate2d(u_time/PI);
	vec2 st = fract(uv*n);

	float size = box_size(uv,n);	
	vec3 color = vec3(box(st,size*0.6),box(st,size*0.8),box(st,size));
	color += vec3(box_wave(st,10.),box_wave(st,20.),box_wave(st,40.))*0.4;
	gl_FragColor = vec4(color,1.0);
}