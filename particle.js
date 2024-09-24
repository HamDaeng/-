// 받을 인자 ) 바꿀 단어가 포함된 String 타입의 문장 또는 바꿀 단어가 들어가있는 List(1DArray)
// 바뀌는 단어 : 은(는), 는(은), 을(를), 를(을), 이(가), 가(이), 와(과), 과(와)
var replace_korean = (line_or_list) => {
  // 값을 담을 변수
  let change_str = [];
  // return 시킬 값
  let complete = [];
  // 타입체크 (Array or String)
  let is_type = Array.isArray(line_or_list) ? [] : "";
  let regex = /(\S(?:은|는|이|가|을|를|와|과)\((?:는|은|가|이|를|을|과|와)\))/g;

  // 타입체크 (1DArray or String 아니라면 쳐내기)
  if (
    Array.isArray(line_or_list[0]) ||
    (typeof line_or_list != "object" && typeof line_or_list != "string")
  ) {
    return "2DArray가 아닌 1DArray 또는 String으로 타입을 맞춰주세요.";
  }

  // String 타입일 경우
  if (typeof is_type === "string") {
    // 함수 호출 change_replace
    change_str = change_replace(line_or_list, regex);

    // replace를 위해 임시변수 생성
    let temp_line = String(line_or_list);

    // 함수에서 넘어온 값을 Key 개수만큼 반복
    for (const last of Object.keys(change_str)) {
      // 대상없음 일 경우 무시 (대상없음 == 바꿀 값 없음)
      if (last != "대상없음") {
        // 한 줄에 여러개가 바뀌어야 할 경우가 있으니, 계속 갱신
        complete = temp_line.replaceAll(last, change_str[last]);
        temp_line = complete;
      } else {
        complete = temp_line;
      }
    }
  }
  // String 이 아닐 경우 ( = Array )
  else {
    // line_or_list의 길이 만큼 반복
    for (const item of line_or_list) {
      // 함수호출 change_replace, 값은 change_str에 push
      change_str.push(change_replace(item, regex));
    }
    // change_str의 길이만큼 반복 ( = line의 length )
    for (let idx = 0; idx < change_str.length; idx++) {
      // replace를 위해 임시값 생성
      let temp_line = String(line_or_list[idx]);
      let temp_line_two = "";

      // 함수에서 넘어온 값을 Key 개수만큼 반복
      for (const last of Object.keys(change_str[idx])) {
        // 대상없음 일 경우 무시 (대상없음 == 바꿀 값 없음)
        if (last != "대상없음") {
          // 한 줄에 여러개가 바뀌어야 할 경우가 있으니, 계속 갱신
          temp_line_two = temp_line.replaceAll(last, change_str[idx][last]);
          temp_line = temp_line_two;
        } else {
          // 빈 값을 넘길수는 없으니 기본 내용 그대로 등록
          temp_line_two = temp_line;
        }
      }
      // 최종 값에 push
      complete.push(temp_line_two);
    }
  }
  // 최종값 리턴
  return complete;
};
// 작업 도움용 함수
var change_regex = (item, regex) => {
  // 정규표현식을 사용하여 값 확인 (match)
  let change_str_regex = item.match(regex);
  // return값 임시로 생성
  let result_data = "";
  // null이 아닐경우 (match 성공일 경우)
  if (Boolean(change_str_regex)) {
    // match된 값에 중복을 제거하기 위한 map
    no_duplication_name = change_str_regex
      .map((item, idx) => {
        console.log(idx);

        // 중복이 있을 경우 1번만 실행 (중복제거)
        if (change_str_regex.indexOf(item) === idx) {
          // return값은 object화 시키기 위해 [item,''] 형식
          return [item, ""];
        }
        // 빈값제거
      })
      .filter(Boolean);
    // 오브젝트로 변경
    result_data = Object.fromEntries(no_duplication_name);
  } else {
    // match 실패시 빈값 반환하면 오류 발생. 대상 없음으로 리턴
    result_data = { 대상없음: "대상없음" };
  }
  //결과값 return
  return result_data;
};
// 작업 도움용 함수
var change_replace = (item, regex) => {
  // 작업 대상 변수 선언
  let str = String(item);
  // 도움용 함수 이용 (위에 함수)
  change_str = change_regex(str, regex);

  // 넘어온 값의 Key만큼 반복
  for (const key of Object.keys(change_str)) {
    // 넘어온 Key ex 나은(는) / 너을(를)... 의 맨 앞글자를 Char 형식으로 변경
    let to_char = String(key).trim().charCodeAt(0);
    // 맨 첫번째 글자 저장
    let first_word = String.fromCharCode(to_char);
    // 은(는), 는(은) 일 경우
    if (/(은\(는\)|는\(은\))/g.test(key)) {
      // 해당 object에 ~는, ~은 형태로 변경
      change_str[key] =
        (to_char - 0xac00) % 28 ? first_word + "은" : first_word + "는";
    }
    // 이(가), 가(이) 일 경우
    else if (/(이\(가\)|가\(이\))/g.test(key)) {
      // 해당 object에 ~이, ~가 형태로 변경
      change_str[key] =
        (to_char - 0xac00) % 28 ? first_word + "이" : first_word + "가";
    }
    // 을(를), 를(을) 일 경우
    else if (/(을\(를\)|를\(을\))/g.test(key)) {
      // 해당 object에 ~을, ~를 형태로 변경
      change_str[key] =
        (to_char - 0xac00) % 28 ? first_word + "을" : first_word + "를";
    }
    // 와(과), 과(와) 일 경우
    else if (/(와\(과\)|과\(와\))/g.test(key)) {
      // 해당 object에 ~와, ~과 형태로 변경
      change_str[key] =
        (to_char - 0xac00) % 28 ? first_word + "과" : first_word + "와";
    }
  }

  // 결과값 반환
  return change_str;
};
