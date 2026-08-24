// Baza w mongoDB dziala tak, ze laduje dany model dopiero wtedy, gdy zostanie on uzyty w kodzie. W zwiazku z tym, jesli w kodzie nie uzyjemy modelu, to nie zostanie on zaladowany i nie bedzie mozna go potem uzyc. Dlatego w tym pliku importujemy wszystkie modele, aby byly one dostepne w kodzie.
import Account from "./account.model";
import Answer from "./answer.model";
import Collection from "./collection.model";
import Interaction from "./interaction.model";
import Question from "./question.model";
import TagQuestion from "./tag-question.model";
import Tag from "./tag.model";
import User from "./user.model";
import Vote from "./vote.model";

export { Account, Answer, Collection, Interaction, Question, TagQuestion, Tag, User, Vote };
