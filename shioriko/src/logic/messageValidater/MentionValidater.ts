import {
  BaseValidater,
  ValidateResult,
  ValidateErrorType,
} from "./BaseValidater";

/** メンションの正規表現 */
const MENTION_REGEX = /<@[&]?[0-9]+>/g;
/** 許容するメンション数 */
const MAX_MENTION_COUNT = 50;

export class MentionValidater extends BaseValidater {
  validate(message: string): ValidateResult {
    const rtnResult: ValidateResult = {
      result: true,
      type: ValidateErrorType.Mention,
      message: "",
    };

    const memtions: string[] = message.match(MENTION_REGEX) || [];
    if (memtions.length > MAX_MENTION_COUNT) {
      rtnResult.result = false;
      rtnResult.message = `メンションが${MAX_MENTION_COUNT}件を越えます。`;
    }

    return rtnResult;
  }
}
