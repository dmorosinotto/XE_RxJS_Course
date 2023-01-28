---
theme: white
---

# XE RxJS Course

**Daniele Morosinotto**
[@dmorosinotto](https://twitter.com/dmorosinotto)

Repo: [https://github.com/dmorosinotto/XE_RxJs_Course](https://github.com/dmorosinotto/XE_RxJs_Course)

--

# AGENDA

-   **PERCHE'**: Dove Angular usa gli Observable?
-   **MENTAL MODEL**: Stream / Algoritmo = flusso dati IN -(oper)-> OUT
-   **COME USARE RxJS**: Observable / Subscribe / Subject / Operatori ...
-   **TRICK IN ANGULAR**: Come evitare i subscribe / @Input->obs$ / helpers
-   **EXTRA**: Custom operators / Gestione Errori / \*structuralDirective
-   DEMO: Esempietti con [RxViz](https://rxviz.com) per provare dal vivo
-   **Q & A**: Futuro di Angular & Rx
-   Riferimenti

---

## PERCHE' RxJS

Angular _Dove usa gli Observable?_ chiediamolo a [ChatGPT 🤯...](https://twitter.com/brechtbilliet/status/1610330036799684609)

## Partiamo con un Intro:

> Questo corso si _"potrebbe fare"_ in mezz'ora capendo **fino in fondo** 🧐 questo [video (da min 32-59)](https://www.youtube.com/watch?v=QfvwQEJVOig&t=1923s) / [slides](https://docs.google.com/presentation/d/11oED-HvlTvwsZ3WpunEOO6to6vogo7LSVcX7mUNSTrA/preview?slide=id.g2caf3dbbe5_2_8) by Alex Rickabaugh [@synalx](https://twitter.com/synalx) lui ha il dono della sintesi 🤓 Io no... 😱 😜

--

# MENTAL MODEL

## Un pò di Storia

-   [NON è solo per JS](https://reactivex.io/languages.html) e nasce dal mondo .NET nel 2011/12

-   Rob Wormal parla di vari aspetti **Push** vs Pull + _“Everything is a **Stream**”_ in questo [video (dal min 24:30 1,5x)](https://youtu.be/UHI0AzD_WfY?t=1470) + [slides](https://slides.com/robwormald/everything-is-a-stream)
-   Concetto di **Lazy** vs eager vedi [slide 12-18](https://docs.google.com/presentation/d/11oED-HvlTvwsZ3WpunEOO6to6vogo7LSVcX7mUNSTrA/preview?slide=id.g2c354f8cfc_0_35) di Alex
-   Andrez Saltz ha scritto _"The introduction to Reactive Programming you've been missing"_ che è una bellissimo [documento](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) che introduce ai concetti che stanno alla base degli Observable -> **APPROCCIO REATTIVO (aka FUNZIONALE)** vs classico Imperativo/OOP!
-   Non fatevi intimorire da chi parla del RFP con approcci troppo matematici tipo questo [paper](https://dl.acm.org/doi/pdf/10.1145/3563837.3568340) sarà anche formalmente corretto, ma potete tranquillamente ignorarlo se non dovete dare un esame all'Università!

## I veri Concetti della Programmazione / Applicazione Reattiva sono:

**MENTAL MODEL**: Stream / Algoritmo = flusso dati IN -(oper)-> OUT

-   Le _variabili_ (ingressi/uscite e tutte quelle intermedie di calcolo) possono essere viste come un **flusso dei valori** nel tempo (aka Stream).
-   C'è un _"modo diverso"_ di scrivere ALGORITMI `out=function(in)` anzi di **DESCRIVERE UN ALGORITMO** in termini di _trasformazioni (sequenze di **operatori**)_ che vengono applicate al _flusso dei dati_ in ingresso (Obs<IN>) per produrre lo stream dei risultati (Obs<OUT>)
-   Gli **operatori** non sono altro che **Funzioni: `(obs<I>) => obs<O>`**
-   Il obs.**pipe** che usiamo per creare la pipeline degli operatori in verità non fa altro che _function composition_ `pipe(f,g,h) = f(g(h( )))`

> Il **FP** (Functional Programming) richiede un minimo di "astrazione" per capire che le funzioni sono _"first class object"_ ossia possono **esser trattate come dati** (possono esser passate come parametri ad altre funzioni e/o esser prodotte come risultato di una funzione) ed ecco che avrete capito la base del "meta-programming" ^\_^

---

# COME USARE RxJS

## LE BASI

[**Observable** / subscribe](https://rxjs.dev/guide/observable)
![Marble Diagram ossia Observable rappresentato come timeline](https://gist.githubusercontent.com/staltz/868e7e9bc2a7b8c1f754/raw/925e96ffefb044788f59754cd40908692c6024e5/zclickstream.png)

-   E' una _classe_ a cui viene passata una funzione che riceve un **subscriber** [Observer Pattern](https://reactivex.io/documentation/observable.html) e che può ritornare una funzione di **teardown** usata per fare pulizia in chiusura.

```
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
```

-   Può _emettere_ 0, 1 o più **valori nel tempo** chiamando `sub.next(val)`
-   Può _terminare_ emettendo un **errore** chiamando `sub.error(err)`
-   Può segnalare quando _finisce_ **non emetterà più niente** `sub.complete()`
-   Sia `error` che `complete` sono **eventi terminali** ossia dopo di essi il _subscriber_ è garantito di **NON ricever più niente**!

```
const sub = { //sub E' DI TIPO Subscriber O SEMPLICEMENTE Observer<T>
    next: (val:T)=>console.log(val),
    error: (err)=>console.error(err),
    complete: ()=>console.warn("done")
}
let s = obs$.subscribe(sub); //FA PARTIRE L'OBSERVABLE E RITORNA Subscription
... volendo in un secondo momento ...
s.ubsubscribe(); //PER SMETTERE DI RICEVERE LE NOTIFICHE ED ESEGUIRE teardown
```

-   Per _farlo partire_ è **necessario eseguire** la `subscribe` passando un oggetto `sub` che contiene le callback di _next, error e complete_; che consentono al chiamante di ricevere le varie notifiche degli eventi che succedono.
-   Se il chiamante memorizza il valore di ritorno `s` della subscribe ha in mano una [Subscription](https://rxjs.dev/guide/subscription) che contiene il metodo di `unsubscribe()` che permette al chiamante di _staccarsi preventivamente_, ossia **smettere di ricevere le notifiche** emesse dall'Observable e fargli eseguire l'eventuale logica interna di **teardown** per fargli _far pulizia_!

--

**Come creare Observable**

Il costruttore non è l'unico modo di creare Observable, anzi il più delle volte si usano altri metodi _Creational_ vedi questo [articolo omnicomprensivo](https://medium.com/angular-in-depth/the-extensive-guide-to-creating-streams-in-rxjs-aaa02baaff9a) su come costruire stream:

-   ad esempio a partire da sequenze note: `of(1,2,3,42)`
-   o da `timer(10,250)` o `interval(1000)`
-   o da Eventi del DOM `from(btn, "click")`
-   oppure anche da **Promise** aticolo Ben Lesh su [interop](https://benlesh.medium.com/rxjs-observable-interop-with-promises-and-async-await-bebb05306875) Obs$ / Promise / async-await

--

**Vari tipi di [Subject](https://rxjs.dev/guide/subject)**

Normalmente gli Observable si possono solo _consumare_ tramite la `subscribe` e il loro compito interno è quello di produrre i valori, ma esistono casi in cui è interessante dall'esterno poter _comandare_ (ossi forzare l'Obsevable ad emettere un valore o andare in errore o completare).

In questi casi si ha a che fare con dei **Subject** ossia oggetti che espongono oltre alla classica interfaccia Observable anche il pattern [Observer](https://rxjs.dev/guide/observer) e l'articolo di seguito mostra i vari tipi di Subject che si possono avere: [Subject/Behaviour/Replay/Async](https://levelup.gitconnected.com/rxjs-subjects-explained-with-examples-78ae7b9edfc)

---

## GLI [OPERATORI](https://rxjs.dev/guide/operators)

Come già accennato nel _"MENTAL MODEL"_ gli **Operatori** non sono altro che **funzioni** che trasformano `Observable<IN> => Observable<OUT>` 🤓

Il **pipe** non è altro che l'operatore di composizione funzionale `pipe=f(g(h))` applicato agli Operatori (aka alle funzioni che operano sugli Observable) - e se ci pensate un attimo esso stesso è un operatore 🤯

I più **semplici e comuni** tipo: _map, filter, tap, distinctUntilChange_ sono facilmente capibili guadando questo sito [RxMarble](https://rxmarbles.com) che mostra l'effetto che ha un operatore sulla timeline "interattiva" dei valori emessi.

![Esempio map operator](https://rxjs.dev/assets/images/guide/marble-diagram-anatomy.svg)

> Ogni operatore esprime una trasformazione: ossia _"modifica"_ l'Observable in ingresso, producendone uno di nuovo _"agendo sulla timeline"_ dei valori emessi.

RxJs ne offre moltissimi (100+) e di solito sono raggruppati per [categorie/tipologie](https://rxjs.dev/guide/operators#categories-of-operators) di trasformazione che operano sugli Observable: _Creation / Filtering / HighOrder / Combination_ ...

--

### HighOrder = Observable< Observable<T> >

Una delle cose che succede spesso è che nelle operazioni di _mapping_ a partire da un observable di valori, facciamo partire altri Observable (ad esempio richieste http parametriche sul valore emesso da un observable di un routeParam, o di un input$)
![Observable di Observable](https://gist.githubusercontent.com/staltz/868e7e9bc2a7b8c1f754/raw/925e96ffefb044788f59754cd40908692c6024e5/zresponsemetastream.png)
In questi casi ci troviamo ad avere in uscita `Observable< Observable<T> >` e per poter ricavare i dati di uscita dovremmo gestire delle _"subscription nidificate"_ 🤮

Oppure imparare ad usare gli **HighOrder** che sono degli operatori di _"flattening"_ che permettono appunto di applicare delle **logiche per appiattire** e ricavare un semplice `Observable<R>` dei risultati finali gestendo in diversi modi questi Observable di Obsevable - nel seguente articolo trovate il confronto dei vari operatori: [concat/merge/switch/exaustMap](https://blog.angular-university.io/rxjs-higher-order-mapping/) per capirne le differenze e come/quando usarli 🧐:

    - concatMap -> se devo eseguire tutte le richieste mantenendo l'ordine (tipicamenente uso questo o se posso ignorare richieste più vecchie uso switch)
    - switchMap -> mi aggancio sempre all'ultimo emesso (es: autocomplete)
    - exaustMap -> finchè sta elaborando una richiesta ignore le altre (es: save)
    - mergeMap -> raramente usato perchè implica avere i mix di tutte le risposte senza capirne l'ordine o da quale richiesta originale fossero generate...

--

### Altri operatori Utili:

**Combination**:

-   _combineLatest vs withLatestFrom_: utilissimo per seguire l'andamento di più observable e aggregarli insieme reagendo a ogni emissione [vedi confronto](https://reactive.how/combinelatest)
-   _merge_: utile se si vogliono mettere insieme più Observable ignorando la sorgente, ma avendo in output il mix di tutti gli eventi emessi dai singoli observable
-   _forkJoin_: utile se si usano "Promise" o comunque Observable che terminano! Perchè fa partire richieste in parallelo e aspetta che tutti abbiano finito (aka complete) per emettere l'array dei valori finali raccolti dall'ultima emissione.
-   _takeUntil_: Operatore utile per forzare il complete di un observable quando succede un evento legato ad un altro observable (es: evito usubscrbe con destroy$)

--

**Timebase** Operatori che lavorano _sul "tempo"_: [vedi confronti](https://www.learnrxjs.io/learn-rxjs/concepts/time-based-operators-comparison)

-   _timer vs interval_ timer permette di definire il ritardo della prima emissione
-   _debounceTime vs throttleTime_ [vedi animazione](https://reactive.how/throttletime) per capire la differenza 👀

--

## E se ancora non vi bastasse...

Ci sono 100+ operatori in RxJS (nessuno li conosce tutti) e sinceramente il sito ufficiale di RxJS **FA 💩** soprattutto nelle descrizioni dei vari operatori, ma offre un _**Utilissimo** [WIZZARD 🧐](https://rxjs.dev/operator-decision-tree) per **trovare** l'operatore **Giusto**!_
Oppure potete consultare questa pagina con tutto l'[Albero](http://xgrommx.github.io/rx-book/content/which_operator_do_i_use/instance_operators.html) delle opzioni per scegliere l'Operatore 🤔

Una volta che l'avrete trovato vi consiglio di cercare la **documentazione** ed eventuali _esempi di utilizzo_ nel sito [LEARN RxJS 🤓](https://www.learnrxjs.io/learn-rxjs/operators)

E se la documentazione/marble vi lascia ancora dei dubbi, potete provare a cercare l'operatore anche in questo sito che offre delle [ANIMAZIONI FIGHISSIME 🤩](https://reactive.how) - peccato che _NON_ ci siano per tutti gli operatori (gratuitamente) 😢

O eventualmente potete provare a usare [RXVIZ](https://rxviz.com) per provare **dal vivo** gli esempi di codice presi da LearnRx o scrivervene voi uno che _simuli il vostro caso_ d'uso 🤔

> A volte per definire/scegliere gli operatori da usare bisogna seguire un approccio _"bottom up"_ a partire dai risultati che si vogliono ottenere amdare a ritroso per definire le trasformazioni (operatori da usare) creando dei risultati intermedi, fino ad arrivare a collegarsi agli stream di partenza/ingresso - vedi vecchio [corso egghead](https://app.egghead.io/playlists/introduction-to-reactive-programming-using-rxjs-5) di Andrez che mostra come ottiene i risultati intermedi con startWith() e altri merge()...

---

# TRICK IN ANGULAR

ATTENZIONE: ai **MemoryLeak** che si possono verificare soprattutto se sottoscriviamo Observable che _NON TERMINANO!_ -> possibili soluzioni:

-   Evitare di fare subscribe (nel codice) e utilizzare `"obs$ | async"` nel template!
-   Se si fa _.subscribe()_ lato codice catturare la Subscription e **Ricordarsi di fare** [unsubscribe](https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription#answer-41177163) tipicamente nel _ngOnDestroy()_
-   E' possibile usare [Subscription.add](https://rxjs.dev/api/index/class/Subscription#add) per evitar di fare N variabili subscription e fare unico unsubscribe
-   Trick: definire un `destroy$: Subject` in accopiata con l'operatore [takeUntil](https://rxjs.dev/api/index/function/takeUntil) per esser sicuri che l'Observable termini e quindi non dover più gestire unsubscribe!
-   Trick: usare il mio [base.component](https://gist.github.com/dmorosinotto/efae3315e1339597fca0921b7c944385) con la gestione del Lazy `takeUntilDestroy$()`

--

COME RENDERE UN **@Input() -> obs$** [snippet](https://gist.github.com/dmorosinotto/62ab9acd876f394b0f557917a683ed46)

```
#prop = new BehaviorSubject<T|undefined>(undefined); //TRICK VALORE PARTENZA
protected prop$ = this.#prop.asObservable().pipe(filter(p=>p!==undefined));
@Input() set prop(value: T) { //OGNI VOLTA CHE RICEVO VALORE LO EMETTO TRAMITE prop$
    //if (value!==this.prop)  //ALTRO MODO PER EVITARE LOOP INFINITI [(prop)]="val"
    this.#prop.next(value);
}
get prop(): T|undefined { //ACCESSO ALL'ULTIMO VALORE PUNTUALE
    return this.#prop.getValue();
}
//TRICK PER SUPPORTO TWO-WAY DATABINDING [(prop)]="val" EVITANDO LOOP INFINITI
@Output() propChange=this.prop$.pipe(distinctUntilChanged());
```

-   NOTA: Gli **@Output()** tipicamente sono `= new EventEmitter<T>()` ma in verità EventEmitter [sono dei Subject](https://github.com/angular/angular/blob/15.1.1/packages/core/src/event_emitter.ts#L64) e per finire quando nel template del padre noi scriviamo `(output)="handler($event)"` il compilatore di Angular sotto le fila fà fa una _subscribe_`($event=>handler($event))` quindi alla fine della fiera possiamo marcare **qualsiasi Observable** come `@Output()` e tutto continua a funzionare! 😎

--

TRICK <ng-container \*ngIf=“obs$ | async as val”>
Pattern _"abusato" per estrarre il valore dagli Observable_ lato template **evitando di fare multiple subscription** (tipicamente una per ogni | async) - però soffre di alcuni problemini:

-   Se devo gestire più observable sono costretto a fare cascate di `<ng-container>` 😞
-   Non ho modo di gestire i casi di error e complete! 😢
-   Ancora più grave: se l'obs$ emette valori **Falsy: 0|""|null|undefined|false** il codice **NON FUZIONA!!** perchè la condizione dell'ngIf non vien soddisfatta e quindi oltre a perdere il valore Falsy _distruggo anche i componenti_ nel `<ng-container>`! 😱

-   SOLUZIONE: usare [@ngrx/component](https://ngrx.io/guide/component) \*ngrxLet oppure il nuovo | ngrxPush \* che risolvono tutti questi problemi! 😍

## EXTRA: eventuale digressione su OnPush e [\*structuralDirective -> TemplateRef](https://dev.to/this-is-angular/mastering-angular-structural-directives-the-basics-jhk) / syntax + let $implicit...

--

TRICK side-effect Intermedi -> `tap( behaviorSubject$ )`
A volte si ha bisogno di catturare dei valori intermedi presenti in una catena di pipe più complessa, siccome [tap](https://rxjs.dev/api/index/function/tap) nella forma più complessa accetta un Observer con {next, error, complete} e dato che i BehaviorSubject -> Subject -> Observer si può scrivere semplicemente `tap(bsTemp$)` per dipanare dei "flussi esterni" dalla catena pipe principale ed inoltre è essendo un BehaviorSubject avere anche il valore puntuale!

TRICK per consentire _multipli | async_ senza far partire piu richieste -> `obs$.pipe(`_share o shareReplay_)
Usate gli operatori di **multicast** (argomento simile/legato ai Subject)che permettono di _evitare di far partire_ un nuova subscription ogni volta che viene fatta la subscribe (aka | async) e invece _"condividere" in qualche modo_ ciò che è già successo nella storia di quell'Observable e i prossimi valori emessi, vi consiglio di leggere questo [articolo sul multicast](https://blog.strongbrew.io/multicasting-operators-in-rxjs/) che spiega i vari operatori: _share/shareReplay/publish,refCount_

---

# EXTRA UTILI:

## CUSTOM operators!

Ebbene sì scoprirete che a volte _nostante tutti gli opertori_ che esistono già in RxJs, vorrete **farne di NUOVI!!** e i motivi più validi per farlo sono:

-   Volete inglobare e dare un nome ad una catena particolare di operazioni complesse che volete riutilizzare [mio gist _retryBackoff_ 🙃](https://gist.github.com/dmorosinotto/9c1859b1ab0b5b914dbb7403f4932d5b)
-   Volete specializzare degli operatori per farne un utility vedi tap -> [mio gist _log_ 😉](https://gist.github.com/dmorosinotto/ee52570db39606e31fbc794bbe9e9dbb)
-   O forse il Team di RxJS si è **veramente dimenticato** di far qualcosa di utile e voi avete avuto l'_"Idea GIUSTA"_ per semplificarvi la vita (e **riutilizzare/incastrare la vostra logica imperativa in un contesto reattivo**🤫) [mio gist _mapFilter_ 🤑](https://gist.github.com/dmorosinotto/f98370a39d9041358915b8a493cf3654)

In ogni caso in questo bellissimo articolo di @NetBasal troverete la spiegazione degli _approcci che potete seguire per farvi_ anche voi dei [custom operators](https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457)

--

## GESTIONE ERRORI

> Una delle cose che si dimentica spesso negli Observable è che dopo un `error` l'observable _TERMINA_ e **NON emetterà più Niente!**

Di conseguenza se non volete scoprire (amaramente 😭) che la vostra bellissima applicazione Reattiva ad un certo punto smette totalmente di funzionare 😵, dovrete imparare a _gestire gli Errori_ ovviamente usare usare gli **operatori di ErrorHandling**: _catchError / of(fallback) / throwError / retry / retryWhen_

In questo articolo troverete diversi spunti su come qu la [gestione Errori](https://blog.angular-university.io/rxjs-error-handling/) su Rx + in questo Ebook troverete un intero [capitolo](https://livebook.manning.com/book/rxjs-in-action/chapter-7/) dedicato all'Error Handling 🤕

TIPS: per quanto possibile mettete la gestione dell'errore quanto più vicino possibile alla possibile causa di errori!
Ad esempio per poter riprovare la chiamata che potrebbe andare in errore all'interno di uno `switchMap(id=>http.get("/api"+id).pipe(retry(2), catch(()=>of(fallback))) );`

--

## Q&A: FUTURO DI NG & Rx

> Q: Ma la community cosa ne pensa di RxJS?

A: Personalmente sò che è molto discusso ed è una delle cose più "odiate" o meglio _"difficili da imparare e padronneggiare"_, ma spero che con tutto quello che vi ho raccontato in questo corso abbiate delle basi solide per **imparare a sfruttarlo**!
Anche perchè diverse persone lo usano e vorrebbero anche di più!
-> Evoluzioni future RxJS: Statemanagementet [selector… reactive](https://dev.to/this-is-angular/i-changed-my-mind-angular-needs-a-reactive-primitive-n2g) 🤙

> Q: E il Team di Angular abbondonerà mai RxJS?

A: Dichiarazione Minko [attule techlead Angular] sul futuro: [Angular more Reactive](https://twitter.com/mgechev/status/1612870428359561217) + video [Future Angular 2023 and beyond](https://youtu.be/7dm4Gif7A5o?t=1922) 🙏

> Q: Qualche suggerimento su come gestire State-management con Rx?

A: A parte il blasonato [NgRX](NGRX.md) che _IO NON AMO_ soprattutto quando viene **abusato** per gestire _State che **NON** è globale_ all'applicazione! Vi consiglio di dare un occhio a [RxAngular](https://rx-angular.io/) che vi permette di scrivere facilmente dei **Servizi** da accopiare ai vostri componenti per _gestire in modo reattivo lo stato "locale"_ dei componenti **collegandolo** eventualmente ad altri Observable (aka Stati globale) + eventuali _effect a livello locale_ guardate questo [video](https://www.youtube.com/watch?v=CcQYj4V2IKw) per capire come si usa _@rx-angular/state_! 🤟

---

# DEMO

Proviamo dal [vivo](https://rxviz.com) alcuni spezzoni di codice che usano RxJs

Bellissimo sito con [animazioni](https://reactive.how) per visualizzare e capire meglio funzionamento/confronto tra operatori

Workshop by [Michael Hladky](https://twitter.com/Michael_Hladky) che mostra passo-passo come gestire pagina contatore con approccio **Reattivo** [EventSource + CQRS](https://docs.google.com/presentation/d/13Eqcjn2Rg-gvFlCS_GBUmoMFn69OYbz7zuQQmJ6gM0c/edit?pli=1#slide=id.p) volendo potete provare la [sfida live](https://stackblitz.com/edit/rxjs-operating-heavily-dynamic-uis-cshhxz?file=index_INITIAL.ts) oppure vedere lo svolgimento dell'[intera soluzione](https://www.youtube.com/watch?v=XKfhGntZROQ)

---

## Q&A + REFERENCE

-   Corso [ThisIsLearning](https://this-is-learning.github.io/rxjs-fundamentals-course/docs/part-1) su RxJS fatto molto bene!
-   Bellissimo [video](https://www.youtube.com/watch?v=QfvwQEJVOig&t=1923s) / [slides](https://docs.google.com/presentation/d/11oED-HvlTvwsZ3WpunEOO6to6vogo7LSVcX7mUNSTrA/preview?slide=id.g2caf3dbbe5_2_8) di Alex Rickabaugh sui concetti di RxJS!
-   Sito [RxViz](https://rxviz.com) per provare visivamente esempietti
-   Sito [RxMarble](https://rxmarbles.com) rappresentazione della timeline operatori
-   Sito [Learn Rx](https://www.learnrxjs.io/learn-rxjs/operators) per docs operatori
-   Sito [Reactive how](https://reactive.how) con animazioni per capire operatori
-   Articolo Ben Lesh su [interop Promise](https://benlesh.medium.com/rxjs-observable-interop-with-promises-and-async-await-bebb05306875) <-> async/await <-> Observable
-   Articolo Netel Basal su [Custom operators](https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457)
    Docs [@ngrx/component](https://ngrx.io/guide/component) helper \*ngrxLet e | ngrxPush
-   Ebook [Capitolo free](https://livebook.manning.com/book/rxjs-in-action/chapter-7/) su gestione degli Errori in RxJS
-   Documento Andre Stalz [“Introduction to Reactive programming”](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) + vecchio [corso su EggHead](https://app.egghead.io/playlists/introduction-to-reactive-programming-using-rxjs-5)
-   Vecchio [video](https://youtu.be/UHI0AzD_WfY?t=1470) + [slides](https://slides.com/robwormald/everything-is-a-stream) di Rob Wormal su "Everything is a Stream"

--

## FEEDBACK & CONTACT

![Me](https://www.xedotnet.org/media/1032/morosinotto_foto.jpg?height=300)

#### Daniele Morosinotto

**Javascript enthusiast**

-   Twitter [@dmorosinotto](https://twitter.com/dmorosinotto)
-   Email [d.morosinotto@icloud.com](d.morosinotto@icloud.com)
-   Repo [https://github.com/dmorosinotto/XE_RxJs_Course](https://github.com/dmorosinotto/XE_RxJs_Course)
