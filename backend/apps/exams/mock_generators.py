def generate_mock_p1() -> dict:
    return {
        "content": {
            "title": "Reading and Use of English Part 1",
            "instructions": (
                "For questions 1–8, read the text below and decide which answer "
                "best fits each gap. There are four options for each question."
            ),
            "segments": [
                {
                    "type": "text",
                    "text": (
                        "THE VALUE OF MAKING MISTAKES\n\n"
                        "For many years, mistakes were seen simply as evidence of failure. "
                        "Students who got answers wrong in class, for example, were often made "
                        "to feel that they had not prepared properly or had not paid enough "
                        "attention. More recently, however, psychologists have begun to "
                    ),
                },
                {"type": "gap", "question_id": "q1", "number": 1},
                {
                    "type": "text",
                    "text": (
                        " the idea that mistakes can play a valuable role in learning. "
                        "According to several studies, people remember information more "
                        "effectively when they have first attempted a task and got part of it "
                        "wrong, rather than when they are given the correct answer immediately.\n\n"
                        "One explanation is that making an error forces the brain to become "
                        "more actively "
                    ),
                },
                {"type": "gap", "question_id": "q2", "number": 2},
                {
                    "type": "text",
                    "text": (
                        " in the learning process. Instead of simply "
                        "accepting information, the learner has to compare expectations with "
                        "reality and then adjust their understanding. This kind of mental effort "
                        "appears to leave a stronger impression, which in "
                    ),
                },
                {"type": "gap", "question_id": "q3", "number": 3},
                {
                    "type": "text",
                    "text": (
                        " makes it less "
                        "likely that the same mistake will be repeated in future.\n\n"
                        "Researchers also point out that the benefits of mistakes are greatest "
                        "when people feel safe enough to take risks. In classrooms where every "
                        "wrong answer is treated as a serious failure, students may avoid "
                        "participation entirely. In more supportive environments, by contrast, "
                        "they are often willing to "
                    ),
                },
                {"type": "gap", "question_id": "q4", "number": 4},
                {
                    "type": "text",
                    "text": (
                        " forward ideas even when they are not "
                        "completely certain of them. As a result, discussion becomes richer and "
                        "learning more memorable.\n\n"
                        "This does not mean, of course, that all mistakes are equally useful. "
                        "Teachers and trainers still need to provide feedback that is clear, "
                        "timely and relevant. Without this, learners may simply continue with an "
                        "incorrect understanding. But when errors are examined carefully rather "
                        "than ignored, they can serve "
                    ),
                },
                {"type": "gap", "question_id": "q5", "number": 5},
                {
                    "type": "text",
                    "text": (
                        " a starting point for deeper "
                        "reflection.\n\n"
                        "In the end, the lesson may be a simple one: progress rarely depends on "
                        "getting everything right the first time. On the contrary, a willingness "
                        "to learn from failure is often one of the most "
                    ),
                },
                {"type": "gap", "question_id": "q6", "number": 6},
                {
                    "type": "text",
                    "text": (
                        " qualities a "
                        "person can develop. People who see mistakes as part of growth are less "
                        "likely to lose confidence after setbacks, and more likely to remain "
                    ),
                },
                {"type": "gap", "question_id": "q7", "number": 7},
                {
                    "type": "text",
                    "text": (
                        " in difficult tasks long enough to improve. In that sense, being "
                        "wrong from time to time may be not a weakness but a sign that real "
                        "learning is actually taking "
                    ),
                },
                {"type": "gap", "question_id": "q8", "number": 8},
                {"type": "text", "text": "."},
            ],
            "questions": [
                {
                    "question_id": "q1",
                    "number": 1,
                    "options": [
                        {"key": "A", "text": "support"},
                        {"key": "B", "text": "raise"},
                        {"key": "C", "text": "place"},
                        {"key": "D", "text": "set"},
                    ],
                },
                {
                    "question_id": "q2",
                    "number": 2,
                    "options": [
                        {"key": "A", "text": "engaged"},
                        {"key": "B", "text": "occupied"},
                        {"key": "C", "text": "interested"},
                        {"key": "D", "text": "focused"},
                    ],
                },
                {
                    "question_id": "q3",
                    "number": 3,
                    "options": [
                        {"key": "A", "text": "turn"},
                        {"key": "B", "text": "fact"},
                        {"key": "C", "text": "case"},
                        {"key": "D", "text": "time"},
                    ],
                },
                {
                    "question_id": "q4",
                    "number": 4,
                    "options": [
                        {"key": "A", "text": "set"},
                        {"key": "B", "text": "put"},
                        {"key": "C", "text": "take"},
                        {"key": "D", "text": "bring"},
                    ],
                },
                {
                    "question_id": "q5",
                    "number": 5,
                    "options": [
                        {"key": "A", "text": "as"},
                        {"key": "B", "text": "like"},
                        {"key": "C", "text": "with"},
                        {"key": "D", "text": "for"},
                    ],
                },
                {
                    "question_id": "q6",
                    "number": 6,
                    "options": [
                        {"key": "A", "text": "powerful"},
                        {"key": "B", "text": "heavy"},
                        {"key": "C", "text": "serious"},
                        {"key": "D", "text": "intense"},
                    ],
                },
                {
                    "question_id": "q7",
                    "number": 7,
                    "options": [
                        {"key": "A", "text": "attached"},
                        {"key": "B", "text": "committed"},
                        {"key": "C", "text": "involved"},
                        {"key": "D", "text": "devoted"},
                    ],
                },
                {
                    "question_id": "q8",
                    "number": 8,
                    "options": [
                        {"key": "A", "text": "place"},
                        {"key": "B", "text": "part"},
                        {"key": "C", "text": "action"},
                        {"key": "D", "text": "effect"},
                    ],
                },
            ],
        },
        "answer_key": {
            "q1": {
                "correct": "A",
                "why_correct": (
                    "'Support the idea' is the natural collocation here, meaning that "
                    "psychologists have started to back or agree with that view."
                ),
                "why_others_wrong": {
                    "B": "'Raise the idea' means introduce it, not agree with it.",
                    "C": "'Place the idea' is not a natural collocation in this context.",
                    "D": "'Set the idea' is also not idiomatic here.",
                },
            },
            "q2": {
                "correct": "A",
                "why_correct": "'Actively engaged in' is the correct and very common collocation.",
                "why_others_wrong": {
                    "B": "'Occupied in' is not the right collocation here.",
                    "C": "'Interested in' changes the meaning and is less precise than 'engaged in'.",
                    "D": "'Focused in' is incorrect; we say 'focused on'.",
                },
            },
            "q3": {
                "correct": "A",
                "why_correct": "The fixed expression is 'in turn', meaning 'as a result' or 'consequently'.",
                "why_others_wrong": {
                    "B": "'In fact' changes the meaning and does not fit the logic here.",
                    "C": "'In case' means 'if', so it is wrong in this context.",
                    "D": "'In time' refers to being not late, which is unrelated here.",
                },
            },
            "q4": {
                "correct": "B",
                "why_correct": "'Put forward ideas' is a fixed expression meaning to suggest or propose them.",
                "why_others_wrong": {
                    "A": "'Set forward' is not the idiomatic phrase here.",
                    "C": "'Take forward' has a different meaning and does not fit this sentence.",
                    "D": "'Bring forward' can mean move to an earlier time, so it is not the best choice here.",
                },
            },
            "q5": {
                "correct": "A",
                "why_correct": "The correct expression is 'serve as', meaning 'function as'.",
                "why_others_wrong": {
                    "B": "'Serve like' is ungrammatical here.",
                    "C": "'Serve with' does not fit the intended meaning.",
                    "D": "'Serve for' can be used in some contexts, but not in this fixed pattern.",
                },
            },
            "q6": {
                "correct": "A",
                "why_correct": "'Powerful qualities' is the most natural collocation and best expresses strong positive impact.",
                "why_others_wrong": {
                    "B": "'Heavy qualities' is not idiomatic here.",
                    "C": "'Serious qualities' sounds odd and does not fit the intended meaning.",
                    "D": "'Intense qualities' is much less natural in this context.",
                },
            },
            "q7": {
                "correct": "C",
                "why_correct": "'Remain involved in' is the correct collocation for continuing participation in tasks.",
                "why_others_wrong": {
                    "A": "'Attached in' is incorrect; 'attached to' would be needed.",
                    "B": "'Committed in' is incorrect; we say 'committed to'.",
                    "D": "'Devoted in' is also incorrect; the preposition should be 'to'.",
                },
            },
            "q8": {
                "correct": "A",
                "why_correct": "The fixed expression is 'take place', meaning 'happen'.",
                "why_others_wrong": {
                    "B": "'Take part' means participate, which changes the meaning.",
                    "C": "'Take action' means do something deliberate, which does not fit here.",
                    "D": "'Take effect' means begin to work, not simply happen.",
                },
            },
        },
        "generator_version": "mock-p1-v3-segments",
        "raw_model_output": "",
        "prompt_log": {
            "source": "hardcoded_mock",
            "notes": "Full 8-gap mock generator using explicit inline segments for the frontend renderer.",
        },
    }


def generate_mock_p2() -> dict:
    return {
        "content": {
            "title": "Reading and Use of English Part 2",
            "instructions": (
                "For questions 9–16, read the text below and think of the word "
                "which best fits each gap. Use only one word for each gap."
            ),
            "segments": [
                {
                    "type": "text",
                    "text": (
                        "WHY WE DELAY IMPORTANT TASKS\n\n"
                        "Most people have, at some point, put off doing something they knew "
                        "was important. Although they may have had every intention of starting "
                        "early, they somehow end up leaving it until the last minute. This is "
                        "often described as procrastination, a habit that many people struggle "
                        "to free themselves "
                    ),
                },
                {"type": "gap", "question_id": "q1", "number": 9, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        ".\n\n"
                        "One common explanation is that people do not delay tasks simply because "
                        "they are lazy. In many cases, the real problem lies "
                    ),
                },
                {"type": "gap", "question_id": "q2", "number": 10, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " the way they feel about the task. If an activity seems boring, "
                        "confusing or stressful, people may avoid it in order to improve their "
                        "mood for a short time. The trouble is that this immediate sense of "
                        "relief is usually followed "
                    ),
                },
                {"type": "gap", "question_id": "q3", "number": 11, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " guilt, which can make the task seem even more unpleasant when they "
                        "eventually return to it.\n\n"
                        "Some researchers argue that procrastination has less to do with poor "
                        "time management than people used to think. Instead, it may be more "
                        "closely connected "
                    ),
                },
                {"type": "gap", "question_id": "q4", "number": 12, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " difficulties in emotional regulation. In other words, people may delay "
                        "work because they find it hard to manage frustration, self-doubt or fear "
                        "of failure.\n\n"
                        "For that reason, experts often recommend breaking large tasks into "
                        "smaller steps. A piece of work that appears impossible at first can seem "
                        "far more manageable once it has been divided "
                    ),
                },
                {"type": "gap", "question_id": "q5", "number": 13, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " simpler stages. It can also help to set very specific goals, rather "
                        "than telling yourself that you will 'do some work later'.\n\n"
                        "Another useful strategy is to pay attention to the stories people tell "
                        "themselves. Someone who says, 'I have to finish this perfectly or not "
                        "start "
                    ),
                },
                {"type": "gap", "question_id": "q6", "number": 14, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        ",' is more likely to remain stuck than someone willing to make a rough "
                        "first attempt. Progress, after all, depends not only on motivation but "
                        "also on the ability to keep going even "
                    ),
                },
                {"type": "gap", "question_id": "q7", "number": 15, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " the conditions are far from ideal.\n\n"
                        "In the end, overcoming procrastination is rarely a matter of becoming a "
                        "completely different person. It is more often about learning how to act "
                        "despite discomfort rather "
                    ),
                },
                {"type": "gap", "question_id": "q8", "number": 16, "placeholder": "word"},
                {
                    "type": "text",
                    "text": (
                        " waiting for the perfect moment to appear."
                    ),
                },
            ],
            "total_gaps": 8,
        },
        "answer_key": {
            "q1": {
                "correct": "from",
                "accepted": ["from"],
                "why_correct": "The fixed expression is 'free themselves from' something.",
                "why_others_wrong": {},
            },
            "q2": {
                "correct": "in",
                "accepted": ["in"],
                "why_correct": "The correct phrase is 'lie in', meaning 'have its cause in'.",
                "why_others_wrong": {},
            },
            "q3": {
                "correct": "by",
                "accepted": ["by"],
                "why_correct": "The correct structure is 'followed by'.",
                "why_others_wrong": {},
            },
            "q4": {
                "correct": "to",
                "accepted": ["to"],
                "why_correct": "The fixed phrase is 'connected to'.",
                "why_others_wrong": {},
            },
            "q5": {
                "correct": "into",
                "accepted": ["into"],
                "why_correct": "We say 'divided into' smaller stages or parts.",
                "why_others_wrong": {},
            },
            "q6": {
                "correct": "at",
                "accepted": ["at"],
                "why_correct": "The expression is 'not start at all'.",
                "why_others_wrong": {},
            },
            "q7": {
                "correct": "when",
                "accepted": ["when"],
                "why_correct": "'Even when' introduces a contrast involving difficult conditions.",
                "why_others_wrong": {},
            },
            "q8": {
                "correct": "than",
                "accepted": ["than"],
                "why_correct": "The structure is 'rather than' + -ing form.",
                "why_others_wrong": {},
            },
        },
        "generator_version": "mock-p2-v1-segments",
        "raw_model_output": "",
        "prompt_log": {
            "source": "hardcoded_mock",
            "notes": (
                "Full 8-gap open cloze mock generator using explicit inline segments "
                "for the frontend renderer."
            ),
        },
    }
