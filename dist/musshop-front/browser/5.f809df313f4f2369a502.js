(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"305l":function(t,e,r){"use strict";r.r(e),r.d(e,"AuthModule",(function(){return G}));var n=r("ofXK"),o=r("tyNb"),i=r("PcjG"),s=r("3Pt+"),a=r("fXoL"),c=r("kt0X"),l=r("kmnG"),m=r("qFsG"),u=r("bTqV");function b(t,e){1&t&&(a.Xb(0,"div",8),a.Xb(1,"p"),a.Gc(2,"This action is only available for registered users."),a.Wb(),a.Xb(3,"p"),a.Gc(4,"Please login or register."),a.Wb(),a.Wb())}function f(t,e){if(1&t&&(a.Xb(0,"div",9),a.Gc(1),a.Wb()),2&t){const t=a.ic();a.Hb(1),a.Hc(t.error)}}const p=function(t){return{returnUrl:t}};let d=(()=>{class t{constructor(t,e,r){this.store=t,this.router=e,this.route=r}ngOnInit(){this.loginForm=new s.e({username:new s.c("",{validators:[s.q.required]}),password:new s.c("",{validators:[s.q.required]})}),this.returnUrl=this.route.snapshot.queryParams.returnUrl,this.returnUrl?(console.log(this.returnUrl),this.showDisclamer=!0):this.returnUrl="/shop",this.store.select(i.b.selectIsAuth).subscribe(t=>{t&&this.router.navigateByUrl(this.returnUrl)}),this.store.select(i.b.selectLoginError).subscribe(t=>this.error=t)}get f(){return this.loginForm.controls}onSubmit(){this.loginForm.invalid||this.store.dispatch(i.a.loginUser({username:this.f.username.value,password:this.f.password.value}))}}return t.\u0275fac=function(e){return new(e||t)(a.Sb(c.h),a.Sb(o.d),a.Sb(o.a))},t.\u0275cmp=a.Mb({type:t,selectors:[["app-signin"]],decls:17,vars:6,consts:[["class","message-pane",4,"ngIf"],[1,"form-wrap"],["class","mat-error",4,"ngIf"],[1,"form",3,"formGroup","ngSubmit"],["routerLink","/auth/signup",3,"queryParams"],["formControlName","username","matInput","","placeholder","Your login","type","text"],["formControlName","password","matInput","","placeholder","Your password","type","password"],["color","primary","mat-raised-button","","type","submit"],[1,"message-pane"],[1,"mat-error"]],template:function(t,e){1&t&&(a.Fc(0,b,5,0,"div",0),a.Xb(1,"div",1),a.Fc(2,f,2,1,"div",2),a.Xb(3,"form",3),a.ec("ngSubmit",(function(){return e.onSubmit()})),a.Xb(4,"h2"),a.Gc(5,"Sign in"),a.Wb(),a.Xb(6,"p"),a.Vb(7),a.Gc(8,"Don't have account?"),a.Ub(),a.Xb(9,"a",4),a.Gc(10,"Sign up"),a.Wb(),a.Wb(),a.Xb(11,"mat-form-field"),a.Tb(12,"input",5),a.Wb(),a.Xb(13,"mat-form-field"),a.Tb(14,"input",6),a.Wb(),a.Xb(15,"button",7),a.Gc(16,"Submit"),a.Wb(),a.Wb(),a.Wb()),2&t&&(a.oc("ngIf",e.showDisclamer),a.Hb(2),a.oc("ngIf",e.error),a.Hb(1),a.oc("formGroup",e.loginForm),a.Hb(6),a.oc("queryParams",a.rc(4,p,e.returnUrl)))},directives:[n.m,s.r,s.l,s.f,o.f,l.a,s.b,m.a,s.k,s.d,u.a],styles:[".form-wrap[_ngcontent-%COMP%]{max-width:400px;margin:20px auto}.form[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{width:80%}.form[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:10px;color:#00f}.form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:10em;outline:none}.mat-error[_ngcontent-%COMP%]{text-align:center}.message-pane[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.message-pane[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--primary-color)}"]}),t})();var g=r("+DfE");function h(t,e){if(1&t&&(a.Xb(0,"div",8),a.Gc(1),a.Wb()),2&t){const t=a.ic();a.Hb(1),a.Hc(t.error)}}const P=function(t){return{returnUrl:t}};let v=(()=>{class t{constructor(t,e,r){this.store=t,this.router=e,this.route=r}ngOnInit(){this.signupForm=new s.e({email:new s.c("",{validators:[s.q.required,s.q.email]}),username:new s.c("",{validators:[s.q.required]}),password:new s.c("",{validators:[s.q.required]})}),this.returnUrl=this.route.snapshot.queryParams.returnUrl||"/shop",this.store.select(i.b.selectIsAuth).subscribe(t=>{t&&this.router.navigate([this.returnUrl])}),this.store.select(i.b.selectRegisterError).subscribe(t=>this.error=Object(g.b)(t))}get f(){return this.signupForm.controls}onSubmit(){this.signupForm.invalid||this.store.dispatch(i.a.registerUser({username:this.f.username.value,password:this.f.password.value,email:this.f.email.value}))}}return t.\u0275fac=function(e){return new(e||t)(a.Sb(c.h),a.Sb(o.d),a.Sb(o.a))},t.\u0275cmp=a.Mb({type:t,selectors:[["app-signup"]],decls:18,vars:5,consts:[[1,"form-wrap"],["class","mat-error",4,"ngIf"],[1,"form",3,"formGroup"],["routerLink","/auth/signin",3,"queryParams"],["formControlName","email","matInput","","placeholder","Your email","type","text"],["formControlName","username","matInput","","placeholder","Your login","type","text"],["formControlName","password","matInput","","placeholder","Your password","type","password"],["color","primary","mat-raised-button","",3,"click"],[1,"mat-error"]],template:function(t,e){1&t&&(a.Xb(0,"div",0),a.Fc(1,h,2,1,"div",1),a.Xb(2,"form",2),a.Xb(3,"h2"),a.Gc(4,"Sign in"),a.Wb(),a.Xb(5,"p"),a.Vb(6),a.Gc(7,"Already have an account?"),a.Ub(),a.Xb(8,"a",3),a.Gc(9,"Sign in"),a.Wb(),a.Wb(),a.Xb(10,"mat-form-field"),a.Tb(11,"input",4),a.Wb(),a.Xb(12,"mat-form-field"),a.Tb(13,"input",5),a.Wb(),a.Xb(14,"mat-form-field"),a.Tb(15,"input",6),a.Wb(),a.Xb(16,"button",7),a.ec("click",(function(){return e.onSubmit()})),a.Gc(17,"Submit"),a.Wb(),a.Wb(),a.Wb()),2&t&&(a.Hb(1),a.oc("ngIf",e.error),a.Hb(1),a.oc("formGroup",e.signupForm),a.Hb(6),a.oc("queryParams",a.rc(3,P,e.returnUrl)))},directives:[n.m,s.r,s.l,s.f,o.f,l.a,s.b,m.a,s.k,s.d,u.a],styles:[".form-wrap[_ngcontent-%COMP%]{width:400px;margin:20px auto}.form[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{width:80%}.form[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:10px;color:#00f}.form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:10em;outline:none}.mat-error[_ngcontent-%COMP%]{text-align:center}"]}),t})();var C=r("SxV6"),w=r("pLZG"),O=r("zP0r"),M=r("IzEk"),X=r("lsfL");function _(t,e){if(1&t){const t=a.Yb();a.Xb(0,"div",2),a.Xb(1,"form",3),a.Xb(2,"div"),a.Xb(3,"span"),a.Gc(4,"Username"),a.Wb(),a.Xb(5,"span"),a.Gc(6),a.Wb(),a.Wb(),a.Xb(7,"div"),a.Xb(8,"span"),a.Gc(9,"Email"),a.Wb(),a.Xb(10,"span"),a.Gc(11),a.Wb(),a.Wb(),a.Xb(12,"div"),a.Xb(13,"label",4),a.Gc(14,"First name"),a.Wb(),a.Tb(15,"input",5),a.Wb(),a.Xb(16,"div"),a.Xb(17,"label",6),a.Gc(18,"Last name"),a.Wb(),a.Tb(19,"input",7),a.Wb(),a.Xb(20,"button",8),a.ec("click",(function(){return a.xc(t),a.ic().updateProfileClick()})),a.Gc(21,"Update profile "),a.Wb(),a.Wb(),a.Wb()}if(2&t){const t=a.ic();a.Hb(1),a.oc("formGroup",t.form),a.Hb(5),a.Hc(t.profile.username),a.Hb(5),a.Hc(t.profile.email),a.Hb(9),a.oc("disabled",!t.form.valid||!t.form.touched)}}const x=[{path:"",redirectTo:"profile",pathMatch:"full"},{path:"signin",component:d,data:{bc:"login"}},{path:"signup",component:v,data:{bc:"register"}},{path:"profile",component:(()=>{class t{constructor(t,e){this.store=t,this.router=e}ngOnInit(){this.store.select(i.b.selectUserProfile).pipe(Object(C.a)()).subscribe(t=>{t?this.profile=t:this.store.dispatch(i.a.loadProfile())}),this.form=new s.e({firstName:new s.c("",{validators:[s.q.minLength(1)]}),lastName:new s.c("",{validators:[s.q.minLength(1)]})}),this.subscribeToProfileChange()}subscribeToProfileChange(t=0){this.store.select(i.b.selectUserProfile).pipe(Object(w.a)(t=>null!=t),Object(O.a)(t),Object(M.a)(1)).subscribe(t=>{this.profile=Object(X.a)(t),this.form.markAsUntouched(),this.profile.firstName&&this.form.controls.firstName.setValue(this.profile.firstName),this.profile.lastName&&this.form.controls.lastName.setValue(this.profile.lastName)})}updateProfileClick(){console.log(this.form.controls.firstName.value),console.log(this.form.controls.lastName.value),this.subscribeToProfileChange(1),this.store.dispatch(i.a.updateProfile({username:this.profile.username,email:this.profile.email,firstName:this.form.controls.firstName.value,lastName:this.form.controls.lastName.value}))}}return t.\u0275fac=function(e){return new(e||t)(a.Sb(c.h),a.Sb(o.d))},t.\u0275cmp=a.Mb({type:t,selectors:[["app-profile"]],decls:4,vars:1,consts:[[1,"page"],["class","fields",4,"ngIf"],[1,"fields"],[3,"formGroup"],["for","firstName"],["type","text","id","firstName","formControlName","firstName"],["for","lastName"],["type","text","id","lastName","formControlName","lastName"],["mat-raised-button","","color","primary",3,"disabled","click"]],template:function(t,e){1&t&&(a.Xb(0,"div",0),a.Xb(1,"h4"),a.Gc(2,"Your profile"),a.Wb(),a.Fc(3,_,22,4,"div",1),a.Wb()),2&t&&(a.Hb(3),a.oc("ngIf",e.profile))},directives:[n.m,s.r,s.l,s.f,s.b,s.k,s.d,u.a],styles:[".page[_ngcontent-%COMP%]{margin-top:60px}h4[_ngcontent-%COMP%]{text-align:center;margin-top:20px;margin-bottom:10px}form[_ngcontent-%COMP%]{margin:20px auto;padding:20px;width:100%;max-width:500px;border:1px solid var(--primary-color);border-radius:4px}form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], form[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-weight:300}form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{display:flex;width:100%;margin:10px 0}form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{flex:2;text-align:left}form[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:first-child{flex:1;text-align:right;margin-right:20px}form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin:0 auto;display:block}"]}),t})(),canActivate:[r("vgUK").a]}];let y=(()=>{class t{constructor(){}}return t.\u0275mod=a.Qb({type:t}),t.\u0275inj=a.Pb({factory:function(e){return new(e||t)},imports:[[o.g.forChild(x)],o.g]}),t})();var W=r("pejm");let G=(()=>{class t{}return t.\u0275mod=a.Qb({type:t}),t.\u0275inj=a.Pb({factory:function(e){return new(e||t)},providers:[],imports:[[n.c,y,s.p,W.a]]}),t})()}}]);