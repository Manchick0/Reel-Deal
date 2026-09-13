execute as @a[advancements={reel:possible_mendthrough=false}] if items entity @s container.* minecraft:fishing_rod[!minecraft:custom_data~{"reel:constructed": true}] run advancement grant @s only reel:possible_mendthrough

execute as @e[type=minecraft:item] at @s if data entity @s "Item"."components"."minecraft:custom_data"."reel:substitution" \
    run function reel:substitute with entity @s "Item"."components"."minecraft:custom_data"."reel:substitution"
    
execute as @e[type=minecraft:fishing_bobber] at @s unless data entity @s "data"."owner" run data modify entity @s "data"."reel:hook" set from entity @p "SelectedItem"."components"."minecraft:custom_data"."hook"
execute as @e[type=minecraft:fishing_bobber] at @s unless data entity @s "data"."owner" run data modify entity @s "data"."owner" set from entity @p UUID