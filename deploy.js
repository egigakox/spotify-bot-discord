const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { discordid, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('test').setDescription('Odpowiada :sunglasses:'),
    new SlashCommandBuilder().setName('pomoc').setDescription('Wyświetla listę komend'),
	new SlashCommandBuilder().setName('artist').setDescription('Podaje informacje o artyście')
    .addStringOption((option) =>
    option.setName('nazwa').setDescription('artysta').setRequired(true)
    ),
    new SlashCommandBuilder().setName('song').setDescription('Podaje informacje o piosence')
    .addStringOption((option) => 
    option.setName('tytuł').setDescription('piosenka').setRequired(true)
    ),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

/*rest.put(Routes.applicationGuildCommands(discordid), { body: commands })
	*/
rest.put(
    Routes.applicationCommands(discordid),
    { body: commands}).then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);