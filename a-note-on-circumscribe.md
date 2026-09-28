# A Note on "Circumscribe"

Creating datapacks is a routine full of repetition. Literal repetition of the same source a dozen of times across the codebase. The reason is the lack of any "reference" mechanisms for the largest part of datapack infrastracture.

In order to **circumvent** these limitation, which grew especially large when working on Reel Deal due to its natural repetitiveness, people have long come up with a solution. That solution has sadly slowly become almost extinct in the modern day and age. That "solution" is a general-purpose macro tool that isn't tied to a specific language.

With [GNU m4](https://www.gnu.org/software/m4/) being the only well-known general-purpose macro solution, and me having a ton of experience with creating similar stuff, I decided to take on the (quite interesting in ways a general-purpose programming language isn't) challenge of writing one myself.

That's how **Circumscribe** was born.

> [!NOTE]
> Circumscribe is available for public usage on NPM:
>
> ```sh
> npm install -g circumscribe
> ```

## Usage of Circumscribe in Reel Deal

The concept behind circumscribe is as follows: The tool attempts to locate any "_circumscribed_" files across the codebase, substitute any expressions (marked with `<expression>`) within them, and produce an according "_normalized_" file.

A file is deemed "circumscribed" if its basename is surrounded with a pair of angle brackets (`<example>.txt`) — if it's "written around" with angle brackets — if it's "circumscribed".

```json
// <pack>.mcmeta
{
    "pack": {
        // note the <version>:
        "description": "§o*An incredibly floppy bassline*\n§8@Manchick | v§7<version>",
        "max_format": [121, 0],
        "min_format": [121, 0]
    }
}
```

In the context of Reel Deal, the `src/` directory contains the written sources including the circumscribed files. Those are then picked up by circumscribe in `build.sh` and are substituted into the `build/` directory.

The `.circumscribe` file contains all macro definitions used by Reel Deal throughout the codebase. Among others, they include a way of constructing a **fishing rod** from a given **line** and a **hook** — something used extensively for creating all possible fishing rod permutations.

Once circumscribe finishes, the `build/` directory contains a working Reel Deal datapack that may be applied in-game.
