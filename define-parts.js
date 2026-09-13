import * as path from "node:path";
import * as fs from "node:fs";

const LINES = JSON.parse(fs.readFileSync(path.join(process.cwd(), "lines.json")));
const HOOKS = JSON.parse(fs.readFileSync(path.join(process.cwd(), "hooks.json")));

const DEFINITION_PATH = path.join(process.cwd(), "data/reel/loot_table/definition");
const ADVANCEMENT_PATH = path.join(process.cwd(), "data/reel/advancement/recipes");
const RECIPE_PATH = path.join(process.cwd(), "data/reel/recipe");
const IDENTIFIER = /^([a-z0-9_.-]+):([a-z0-9/_.-]+)$/;

function main() {
    for (const line of LINES) {
        definePart(line, "tooltip.reel.line");
        for (const hook of HOOKS) {
            definePart(hook, "tooltip.reel.hook");
            defineRecipe(line, hook);
            defineAdvancement(line, hook);
        }
    }
    console.log(`[✓] Successfully defined ${LINES.length * HOOKS.length} parts`);
    return 0;
}

/**
 * @param {{ type: string, identifier: string, description: string[] }} line
 * @param {{ type: string, identifier: string, description: string[] }} hook
 */
function defineRecipe(line, hook) {
    const identifiers = [splitIdentifier(line.identifier)[0], splitIdentifier(hook.identifier)[0]];
    const names = [splitIdentifier(line.identifier)[1], splitIdentifier(hook.identifier)[1]];
    const destination = path.join(RECIPE_PATH, names[0], names[1]);
    const recipe = {
        "type": "minecraft:crafting_shaped",
        "group": "reel:fishing_rod",
        "category": "equipment",
        "pattern": [
            "  S",
            " SL",
            "S H"
        ],
        "key": {
            "S": "minecraft:stick",
            "L": `${line.type}`,
            "H": `${hook.type}`
        },
        "result": {
            "id": "minecraft:fishing_rod",
            "components": {
                "minecraft:lore": [
                    "",
                    [
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                        { "text": "\u0001", "color": "white", "font": "reel:specification", "bold": false, "italic": false },
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                        {
                            "translate": `item.${identifiers[0]}.${names[0]}`,
                            "color": "white",
                            "font": "minecraft:default",
                            "italic": false
                        },
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false }
                    ],
                    "",
                    ...indentDescription(line.description),
                    "",
                    [
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                        { "text": "\u0001", "color": "white", "font": "reel:specification", "bold": false, "italic": false },
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                        {
                            "translate": `item.${identifiers[1]}.${names[1]}`,
                            "color": "white",
                            "font": "minecraft:default",
                            "italic": false
                        },
                        { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false }
                    ],
                    "",
                    ...indentDescription(hook.description),
                    "",
                    "§r§9Reel Deal"
                ],
                "minecraft:custom_data": {
                    "reel:constructed": true,
                    "reel:line": `${identifiers[0]}:${names[0]}`,
                    "reel:hook": `${identifiers[1]}:${names[1]}`
                },
                "minecraft:custom_model_data": {
                    "strings": [`${identifiers[0]}:${names[0]}`, `${identifiers[1]}:${names[1]}`]
                }
            }
        }
    }
    console.log(`[+] Writing recipe for ${line.identifier}/${hook.identifier}...`)
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(`${destination}.json`, JSON.stringify(recipe, null, 4));
}

/**
 * @param {{ type: string, identifier: string, description: string[] }} line
 * @param {{ type: string, identifier: string, description: string[] }} hook
 */
function defineAdvancement(line, hook) {
    const identifiers = [splitIdentifier(line.identifier)[0], splitIdentifier(hook.identifier)[0]];
    const names = [splitIdentifier(line.identifier)[1], splitIdentifier(hook.identifier)[1]];
    const destination = path.join(ADVANCEMENT_PATH, names[0], names[1]);
    const advancement = {
        "parent": "minecraft:recipes/root",
        "criteria": {
            "has_line": {
                "trigger": "minecraft:inventory_changed",
                "conditions": {
                    "items": [
                        {
                            "predicates": {
                                "minecraft:custom_data": {
                                    "reel:identifier": `${identifiers[0]}:${names[0]}`
                                }
                            }
                        }
                    ]
                }
            },
            "has_hook": {
                "trigger": "minecraft:inventory_changed",
                "conditions": {
                    "items": [
                        {
                            "predicates": {
                                "minecraft:custom_data": {
                                    "reel:identifier": `${identifiers[1]}:${names[1]}`
                                }
                            }
                        }
                    ]
                }
            },
            "has_the_recipe": {
                "trigger": "minecraft:recipe_unlocked",
                "conditions": {
                    "recipe": `reel:${names[0]}/${names[1]}`
                }
            },
        },
        "requirements": [["has_line", "has_hook", "has_the_recipe"]],
        "rewards": {
            "recipes": [`reel:${names[0]}/${names[1]}`]
        }
    }
    console.log(`[+] Writing advancement for ${line.identifier}/${hook.identifier}...`)
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(`${destination}.json`, JSON.stringify(advancement, null, 4));
}

/**
 * @param {{ type: string, identifier: string, description: string[] }} candidate 
 * @param {string} tooltip
 */
function definePart(candidate, tooltip) {
    const [namespace, name] = splitIdentifier(candidate.identifier);
    const destination = path.join(DEFINITION_PATH, name);
    const definition = {
        "pools": [
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "minecraft:item",
                        "name": `${candidate.type}`,
                        "functions": [
                            {
                                "function": "minecraft:set_components",
                                "components": {
                                    "!minecraft:entity_data": {},
                                    "minecraft:item_name": {
                                        "translate": `item.${namespace}.${name}`
                                    },
                                    "minecraft:item_model": `${namespace}:${name}`,
                                    "minecraft:custom_data": {
                                        "reel:identifier": `${namespace}:${name}`
                                    },
                                    "minecraft:max_stack_size": 1,
                                    "minecraft:rarity": "common",
                                    "minecraft:lore": [
                                        "",
                                        [
                                            { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                                            { "text": "\u0001", "color": "white", "font": "reel:specification", "italic": false },
                                            { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false },
                                            {
                                                "translate": "tooltip.reel.when_applied_as",
                                                "with": [
                                                    {
                                                        translate: `${tooltip}`,
                                                        color: "gray",
                                                        font: "minecraft:default",
                                                        italic: false
                                                    }
                                                ],
                                                "color": "dark_gray",
                                                "font": "minecraft:default",
                                                "italic": false
                                            },
                                            { "text": "\u0020", "color": "white", "font": "minecraft:default", "italic": false }
                                        ],
                                        "",
                                        ...indentDescription(candidate.description),
                                        "",
                                        "§r§9Reel Deal"
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
    console.log(`[+] Writing definition for ${candidate.identifier}...`)
    fs.writeFileSync(`${destination}.json`, JSON.stringify(definition, null, 4));
}

/**
 * @param {string[]} description
 * @returns {string[]}
 */
function indentDescription(description) {
    const buffer = [];
    for (const line of description) {
        buffer.push(`§l §r§7   ${line} `);
    }
    return buffer;
}

/**
 * @param {string} identifier
 * @returns {[string, string] | undefined}
 */
function splitIdentifier(identifier) {
    const match = IDENTIFIER.exec(identifier);
    if (match)
        return [match[1], match[2]];
    return undefined;
}

process.exit(main());