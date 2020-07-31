const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {type: String, maxlength: 100},
  img: { type: String, default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAM1BMVEXU1tT8/vz////R1NH7+vvZ2tnh4eH49/jq6urn5ufv7u/z8fPS09Lk4+Tf3t/c3Nzy9PLFcvhgAAADGklEQVR4nO2a2XKrMBBEjVaQWfz/X3uR4zjGCWjpHpKqq/PEG12zSZqZy6XRaDQajUaj0fgf0CsXuyzjRY/r1+m/X/89BG8inTE+DM5ezpQx2j4Y1W0x196OZymY/bf/P1T4yZ5ginG+/fj7B34S94fbMcATZSZRATYc//+DYMUEjM7kKFiZpOKyzxSweiPIKLgmomCj4SrhjBIFK15AQZGAqIFth0IbCNghlCvgxqQecrNxS88rlLZOQadmmoTiUPyEFZJ6qAiEhxlIrlgq3XBnoUjIOpr2oGQFZIROEcygISOsZsCjoTYhn+BmmEAFXQ9LAP1AOCpgP3QKLU+uuiw9JYDXWTQfImhOVB8PL2AKrCdIwNJyJijoHCQBrgoraoAk1J/TL2DFaSAoACXkP6AOwA7sJiHyF2Lh9zPiD9QFR5DQYRIWhgTwTUVQYLA7iyYc1h5rPGlCVqKPugW/uMHPa/jOYlAFeInGX5VwWuJtjhH0BJgPd7CXhMIujg8Om/9JIzAUYOfEROn0IC8qT2r7AUnBaTUBLTc10HqfuqIDHbkxx1RVWcHtg9uaNjh3GqDn8m6LY08L50I7EFvgnxTawcwCE1Nd0vkyrILwhs2dzUjNCCOZN0nJkbFe0kVKXaWn9y5xhfGUC8IhejwSYdwovTugresPE8MEJze3jwZYQkYsmDBLmcIOPjcp/bAIrA/YPlfAhwj2HsXqgeJjSgWqJfqqx4TpWZYYpxIXbAzhORsl9ooMZgjbHHoCH3T4jlF5GL6DHZvaVl6dtxp8/bmlZ8ZMJlJ7jdTZm1RJKgOC0el6ovqK7NSUxuuXhqFYA9UGdw2hUAPZBncNZW9cYiR+YYo0UCak3zUUPLBkFBTtGDFq4s8acl0xSSnInhFhKzzHZL63GfsCu2R1Xtg16Y2MoxtfXkmQzgpRN0SSrpAoi28k3r2McViKRHHAR1FpEvOBE4zQdbdfjoTIgRnOiITIwbCops1bw35rWFN2NnLY3TmzJ/nh4OIgeURu2ctLxlZfLjueQIeiRfycE/ZEBTtjZOGLwpaXpYZ/IQAoGV+RzQwAAAAASUVORK5CYII="},
  comments: {type: [], default: []},
  likes: {type: [], default: []},
  timeStamp: { type: Date, default: Date.now },
  userId: { type: String }
});

module.exports = mongoose.model("Post", postSchema);