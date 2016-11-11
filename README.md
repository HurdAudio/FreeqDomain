# FreeqDomain
A web audio api realization of lattice harmonic space

Freeq Domain - an Additive Synthesis Application

Devin Hurd - HurdAudio


What problem does this application solve? 

Despite decades of research and practice, the Tenney theory of Lattice-based Harmonic Space is poorly understood due to lack of teaching aids that clearly demonstrate the relationship between abstraction and sound. Freeq Domain addresses this by making the causal relationship between sound and structure tangible.

Who has this problem?

Freeq Domain is a flexible tool that would benefit members of the drone music community as well as academic composers and theorists. It is an invaluable tool for exploring non-octave based harmonic constructs that would be difficult - if not impossible - to realize in standard MIDI applications. This would be immediately beneficial for my own compositional work.

How will your project solve this problem?

Freeq Domain solves this problem by allowing the user to define their own pitch space with immediate sonic results. This has the additional benefit of functioning as an ear-training aid for hearing precise intervals and intuitively understanding their relationships.

What inputs does it need?

Freeq Domain makes use of standard mouse and keyboard inputs for altering multiple parameters of a sounding object. 

What outputs does it produce?

Freeq Domain is an additive synthesis application that outputs simple waveforms (sine, triangle, square and sawtooth) that may be modulated by Low Frequency Oscillators. The primary focus of Freeq Domain is the frequency content of a given pitch and its relative position to the tonic (1/1). It is intended to function as a drone design tool.

What web APIs will it use?

Freeq Domain uses the oscillators, LFO and effects found in the W3C Web Audio API (https://www.w3.org/TR/webaudio/).

What technologies will it use?

Freeq Domain uses Materialize, Jquery, Javascript and AJAX.

What additional features will it have?

Freeq Domain is a scalable application. The Minimum Viable Product would have working nodes along a single dimension of harmonic space with individual volume and waveform controls. This can then be expanded to support 2, 3 or any number of dimensions of harmonic space. The ability to transform drones by inverting their structure or shifting them into their respective modes is also a modestly achievable feature. Additional stretch goals include storing drone construction as presets, adding an option to morph between drone states, adding effects to the output chain, and generating a fully realized interpretation of James Tenney’s Critical Band composition.

Links to wireframe mockups:

https://wireframe.cc/kSEB1s
https://wireframe.cc/QNu2Ny
https://wireframe.cc/a9m6ou
https://wireframe.cc/As39hk


FreeqDomain makes use of the ANU Quantum Number Generator API for randomizing global variables as well as number of drones along multiple dimensions for realizing randomized harmonic drones.
