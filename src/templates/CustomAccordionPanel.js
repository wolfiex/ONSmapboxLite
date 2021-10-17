
import { Accordion } from 'svelte-collapsible'
import { default as AccordionItem } from './CustomAccordionItem.svelte' 


let items = [
    {
        key: 'a',
        img: 'https://picsum.photos/100?random=1',
        title: 'untoward',
        subtitle: 'unexpected and inappropriate or inconvenient',
        text: 'Suppose you\'re moving toward a goal. You are, as they say, "on the right path." But when you add the prefix un- you reverse that, and you\'re no longer on the path to that goal — you\'re untoward.'
    },
    {
        key: 'b',
        img: 'https://picsum.photos/100?random=2',
        title: 'trill',
        subtitle: 'a quavering or vibratory sound, especially a rapid alternation of sung or played notes.',
        text: 'Many languages include a trill in their pronunciation, the sound of a consonant spoken while the tongue vibrates in a very specific way against the teeth or roof of the mouth. To pronounce this sound is also to trill. The word originally referred to a vibrating or warbling sound made by a singer, from the Italian word trillio, "a quavering or warbling," and its also often used to describe the sound a bird makes.'
    },
    {
        key: 'c',
        img: 'https://picsum.photos/100?random=3',
        title: 'chinwag',
        subtitle: 'a long and pleasant conversation between friends',
        text: 'The journalist, who seems oddly unalarmed by the frequent reports of murders, loves a good chin-wag and keeps trying to chum up to Tshembe, who wants none of him.'
    }
]
