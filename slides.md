---
theme: white
---

# XE RxJS Course

**Daniele Morosinotto**
[@dmorosinotto](https://twitter.com/dmorosinotto)

Repo: [https://github.com/dmorosinotto/XE_RxJs_Course](https://github.com/dmorosinotto/XE_RxJs_Course)

--

# AGENDA

-   **PERCHE'**: Dove Angular usa gli Observable chiediamolo a [ChatGPT...](https://twitter.com/brechtbilliet/status/1610330036799684609)
-   **BASI**: Observable / Subject / Subscribe -> _STREAM DATI_
    -   Esempietti con [RxViz](https://rxviz.com) per provare dal vivo...
-   **MENTAL MODEL**: Stream / flusso dati (IN -> OUT)
    -   Passaggio da Imperativo -> Funzionale
    -   PIPE = catena Opetoriper collegare IN -> OUT (delle volte bottom up)
    -   Uso Operatori piu comuni (map, filter, tap, distinctUntilChange, debounceTime, switchMap, takeUntil, retry, combineLatest…) -> MOSTRO RxMarble principali / sito learnRx?
    -   Far vedere come farsi OPERATORI CUSTOM (log, filterNil, mapFilter vedi miei git) e possibilità di usar logica imperativa dentro al funzionale
    -   CONCETTO PROGRAMMAZIONE / APPLICAZIONE REATTIVA
-   ATTENZIONE: ai MemoryLeak (possibile soprattutto se sottoscrivo Observable che NON TERMINANO)
-   TRICK IN ANGULAR:

    -   Attenzione ai MemoryLeak:
        -   possibilmente mai fare Subscribe a mano / ricordare Unsubcribe
        -   oppure Subscription cumulativa / o trick takeUntil
        -   meglio far sul template | async
    -   Trick <container \*ngIf=“obs$ | async as val”>
        -   attenzione problemino emissione Falsy + non gestisce Error/Complete
        -   meglio usare RxComponent \*ngrxLet oppure il nuovo | ngrxPush https://ngrx.io/guide/component
        -   (eventuale digressione su \*structuralDirective -> TemplateRef / syntax)
    -   Trick uso Input reattivi -> snippet BS + get/set e obs$.pipe(filterNil)
    -   Trick baseCompoent con ngDestory -> takeUntilDestory() vedi mia gist
    -   Trick side effect intermedi -> tap(BS) + dipanare flussi esterni da catena pipe principale…

-   Extra: eventuale digressione su OnPush e \*structuralDirective -> TemplateRef / syntax ...
-   Q & A
-   Riferimenti

--

# Intro

## PERCHE' RxJS

Angular _Dove usa gli Observable?_ chiediamolo a [ChatGPT...](https://twitter.com/brechtbilliet/status/1610330036799684609)

Paprtiamo con un **Intro** [video](https://www.youtube.com/watch?v=QfvwQEJVOig&t=1923s) / [slides](https://docs.google.com/presentation/d/11oED-HvlTvwsZ3WpunEOO6to6vogo7LSVcX7mUNSTrA/preview?slide=id.g2caf3dbbe5_2_8) by @synalx Alex Rickabaugh!

---

# LE BASI RxJS

## Un pò di Storia

-   Nasce dal mondo .NET nel 2012
-   Rob Warmal "Everything is a stream" []
-   Andrez Saltz "Reactive programming"
-   Formal [paper]() su RxJS

--

## Observable

## Subscribe -> Observer Pattern

## Subject

---

# MENTAL MODEL

---

# ATTENZIONE

---

# TRICK IN ANGULAR

---

# DEMO

Corso Andres Stalz su [egghead]() che mostra come creare observable / collegare stream per ottenere applicazione reattiva...

Proviamo dal [vivo "visivamente"]() come funzionano gli Observable

Bellissimo sito con animazioni funzionamento/confronto operatori

---

## Extra: utilizzo _OnPush_ e _\*structuralDirective_

-   Change detection OnPush
-   \*structuralDirective -> TemplateRef + syntax + let $implicit

---

## Q&A + REFERENCE

-   Bellissime [SLIDE](https://docs.google.com/presentation/d/11oED-HvlTvwsZ3WpunEOO6to6vogo7LSVcX7mUNSTrA/preview?slide=id.g2caf3dbbe5_2_8) di Alex su RxJS + [Video (da min 32->1h)](https://www.youtube.com/watch?t=32m3s&v=QfvwQEJVOig&feature=youtu.be)
-   Guardare corso https://this-is-learning.github.io/rxjs-fundamentals-course/docs/part-1
-   Sito [RxViz](https://rxviz.com) per provare visivamente esempietti...
-   Sito [RxMarble](https://rxmarbles.com) rappresentazione canonica operatori
-   Learn RxJS operators: https://www.learnrxjs.io/learn-rxjs/operators
-   Doc ufficiale [Rx Observable](https://reactivex.io/documentation/observable.html)
-   Doc [@ngrx/component](https://ngrx.io/guide/component) helper \*ngrxLet e | ngrxPush
-   Sito RxJS per [scegliere operatore](https://rxjs.dev/operator-decision-tree)
-   Sito con [animazioni fighe](https://reactive.how) per capire funzionamento operatori
-   Articolo che spiega “Come costruire stream onnicomprensivo” [intro-full](https://medium.com/angular-in-depth/the-extensive-guide-to-creating-streams-in-rxjs-aaa02baaff9a) RxJs
-   Articolo su [HighOrder operator](https://blog.angular-university.io/rxjs-higher-order-mapping/) differenze: concat/merge/switch/exhaustMap
-   Articolo su diversi tipi di [Subject/Behaviour/Replay](https://levelup.gitconnected.com/rxjs-subjects-explained-with-examples-78ae7b9edfc)
-   Articolo su [multicast](https://blog.strongbrew.io/multicasting-operators-in-rxjs/) / share / replay
-   Articolo Ben Lesh su [interop Promise](https://benlesh.medium.com/rxjs-observable-interop-with-promises-and-async-await-bebb05306875) <-> async/await <-> observable
-   Risposte StankOverflow su come [gestire unsubscribe](https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription#answer-41177163)
-   Articolo su [custom operators](https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457) by NetBasal + miei Gist operatori custom [mapFilter/debug](https://gist.github.com/dmorosinotto/f98370a39d9041358915b8a493cf3654)
-   Articolo su com [gestione Errori](https://blog.angular-university.io/rxjs-error-handling/) su Rx
-   Libro su RxJs - [capitolo](https://livebook.manning.com/book/rxjs-in-action/chapter-7/) su Error Handling
-   Documento Stalz [“Introduction to Reactive programming”](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
-   Vecchio corso di Andres su RxJs [EggHead](https://app.egghead.io/playlists/introduction-to-reactive-programming-using-rxjs-5)
-   Rob Warmal “Everything is a stream” [video (da min 24:30 1,5x)](https://youtu.be/UHI0AzD_WfY?t=1470) + [slides](https://slides.com/robwormald/everything-is-a-stream)
-   Evoluzioni future RxJ -> Statemanagementet [selector… reactive](https://dev.to/this-is-angular/i-changed-my-mind-angular-needs-a-reactive-primitive-n2g)
-   Dichiarazione Minko su future [Angular more Reactive](https://twitter.com/mgechev/status/1612870428359561217)
-   [Paper](https://dl.acm.org/doi/pdf/10.1145/3563837.3568340) su semantica RxJS (formalismi funzionali/matematici...)

---

## FEEDBACK & CONTACT

![Me](https://www.xedotnet.org/media/1032/morosinotto_foto.jpg?height=300)

#### Daniele Morosinotto

**Javascript enthusiast**

-   Twitter [@dmorosinotto](https://twitter.com/dmorosinotto)
-   Email [d.morosinotto@icloud.com](d.morosinotto@icloud.com)
-   Repo [https://github.com/dmorosinotto/XE_Modernize_Angular](https://github.com/dmorosinotto/XE_Modernize_Angular)
