# 
# reel:subsitute
# ---
# Create an substitution entity as specified by
# the provided $(identifier) that mirrors the motion of
# the callee, then remove the callee.
#
$execute as @s at @s run summon $(identifier) ~ ~ ~ { Tags: ["substitution"] }
execute as @s at @s run data modify entity @n[tag=substitution] Motion set from entity @s Motion
execute as @s at @s run tag @n[tag=substitution] remove substitution
execute as @s at @s run kill @s