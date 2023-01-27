@Component({})
export class FiglioComponent {
    @Input() fn: (s:string)=>void;
    @Input() pippo: string;
    @Ouput() pippoChange = new EventEmitter<string>()

    private #prop = new BehaviourSubject<number|undefined>(undefined);
    protected prop$ = this.#prop.asObservable();
    @Input() set prop(value: number) {
        //if (value!==this.prop)
        this.#prop.next(value);
    }
    get xxx(): number|undefined {
        return this.#prop.getValue();
    }
    @Output() propChange = this.prop$.pipe(filter(p=>p===undefined), distinctUntilChange())

    
}

@Component({
    template: `<figlio [fn]="handleprop"
        [pippo]="str" (pippoChange)="str=$event"
        [(pippo)]="str"
        [prop]="str" (_prop)="handleprop($event)" 
                     (prop$)="handleprop($event)"
    ></figlio>`
})
export class PadreComponent {
    public str: string;
    
    function handleprop($event: string) {
        if ($event!==this.str)
            this.str = $event.toUpperCase()
     }

     fpointer = (x:string)=>this.handleprop(x);
     fpointer = this.handleprop.bind(this);


}


function getData(): Promise<D> {
    return fetch<D>("api/...")
}


function doSomethingWithPromise() {
    console.log("inizio")
    var p = getData()
            .then(d => {
                console.warn(d);
                if (Valid(d)) updateUi(d.Format)
            })
            .catch(e=>console.error(e))
    console.log("fine");
    
}

async function doSomethingWithPromiseAsync() {
    console.log("inizio")
    try {
        var d = await getData();
        console.warn(d);
        if (Valid(d)) updateUi(d.Format)
        await qualsaltro(d);
        console.log("dopo")
    } catch(e) {
        console.error(e)
    }
    console.log("fine")
}


service {
    obs;
    getInitialElaborateObs$ => http.get("aaa").pipe(f,g,h) 
}
pipe(f,g,h) [f,g,h] [h,g,f]
obs => f(g(h(obs)))

component{
var s = inject(service);
var obs$=s.getInitialElaborateObs$.pipe( shareReplay(),tap(log), takeUntil($destory))
<container *ngIf="(obs$ | async) as val1">
    <figlio input="val1"></figlio>
    <fratella input$="obs$"></fratella>
</container>
<container *ngIf="(obs$ | async) as val2">
   
</container>
}


var arr = [11,22,33];
var tot = arr.reduce((acc,x)=>acc+x, -42);

pipe = function(...fns: (I$=>O$)[]) {
    return (obs) => fns.inverse().reduce((y,fn)=>fn(y), obs)
}


map(f) = arr.reduce((at, x)=>{ at.push(f(x)); return at  }, [])
filter(p) = ar.reduce((af,x)=>{ if(p(x) af.push(x)); retrn af },[])


const obs$ = new Observable(sub => { //IL COSTRUTTORE VOLE UNA FUNZIONE PER RICEVERE IL SUBSCRIBER (Observer Pattern)
    const i = setInterval(()=>{
        let rnd = Math.random();
        if (rnd>0.1) sub.next(rnd) //EMETTE UN VALORE RANDOM OGNI 1sec 90%
        else {
            if (rnd<0.03) sub.complete() //OPPURE PUO' TERMINARE 3%
            else sub.error('shit happens'); //O EMETTE UN ERRORE 7%
            clearInterval(i); //IN ENTRAMBI I CASI SMETTE DI EMETTERE
        }
    }, 1000);
    return () => { clearInterval(i) }; //RITORNA LOGICA DI PULIZIA - TEARDOWN
});





var init$ = new Subject()
ngOnInit{
    init$.next();
    init$.complete();
}
var btnFlt$ = from("btnCerca", click);

mapTo(costante) = map(()=>costante)

var resp$ = merge(
                init$.mapTo({filter: null}),
                btnFlt$.mapTo({filter: frmFilter.value}) 
            ).pipe(
                chiamaApiConSpinner(f=>http.get(/api?serch=f),[]),
                takeUntilDestory(),

                tap(()=>spinner(true)),
                log("qui")
                switchMap(f=>http.get(/api?serch=f).pipe(
                    retryBackoff(2), 
                    log("qua")
                    takeUntilDestroy(), 
                    finalize(()=>spinner(false))),
                catchError(e=>of([])),
                )
                log("quo"),
                shareReplay(1),
                takeUntilDestory(),
            )



            export function chiamaApiConSpinner(/*PARAMETRI CONFIG*/) {
                return function(source: Observable<T>): Observable<R> {
                  return source.pipe(
                        //SCRIVI QUI LA TUA CATENA PIPELINE
                  )
                }
            };


            export function chiamaApiConSpinner(chiamata: (value: T)=>Observable<R>, fallback: R) {
                return function(source: Observable<T>): Observable<R> {
                  return source.pipe(
                    tap(()=>spinner(true)),
                    switchMap(f=>chiamata(f).pipe(
                        retry(2), 
                        takeUntilDestroy(), 
                        finalize(()=>spinner(false))),
                    catchError(e=>of(fallback)),
                    )
                    shareReplay(1),
                    
                )
                  
                  
                  .pipe(map(fnTrasformSkipUndefined), filter(value => value !== undefined)) as Observable<Exclude<R,undefined>>;
                }
              }