import os

commits = [
    "30726f9e6965abffc49d8b27dc2ab94d19e28b68",
    "0a7149fae8e19b74ef9cb1503ae84da26f935e40",
    "3e0f13e885df6d16d9c3d1f8d8690b6d44e1db81",
    "8389e298413bf503d9672295811d333fdf8f5d74",
    "0b514d9071fa2ca601f4ce0315ac64436f4c056a",
    "77a46fc8b70f1b0fe217f9d748724f0364e7a505",
    "935b42fd4d5730217288c901efb64b6dd3b9236d",
    "970173b592984b838493cee972e62470b9d0ea39",
    "9e3dd86a9d96fb2bb1490fb56f97e40ae6f9fa24",
    "a53532cec56e919ffa84ca4e5569ff56746f01f5",
    "5d747fb534ffd8d75d1e5eca1fc19a2e88ecfc02",
    "fbbc4dda2e8e80a7e436327c6f6b9f501ca8039a",
    "99010ff11b99cd2e26568d346213234002bc8977",
    "1757838704eee1332210924384a06d2951614fd5",
    "55ef903408a413a2ef9ca1b067ecb62eec594977",
    "a4e9fcb97610a54015e5c375b951f19dcefa69ca"
]

authors = [
    ("Mayantha03", "mayanthachanuka55@gmail.com"),
    ("DinulDH", "imashidinu2003@gmail.com"),
    ("HMHashiniPiumikaHerath", "hashinipiumikaherath@gmail.com"),
    ("sethumi-g", "sethugunathunga@gmail.com")
]

script_content = "git filter-branch -f --env-filter '\n"
for i, commit in enumerate(commits):
    name, email = authors[i % 4]
    if i == 0:
        script_content += f'if [ "$GIT_COMMIT" = "{commit}" ]; then\n'
    else:
        script_content += f'elif [ "$GIT_COMMIT" = "{commit}" ]; then\n'
    script_content += f'    export GIT_AUTHOR_NAME="{name}"\n'
    script_content += f'    export GIT_AUTHOR_EMAIL="{email}"\n'
    script_content += f'    export GIT_COMMITTER_NAME="{name}"\n'
    script_content += f'    export GIT_COMMITTER_EMAIL="{email}"\n'
script_content += "fi\n' HEAD\n"

with open("fix_authors.sh", "w") as f:
    f.write(script_content.replace('\r\n', '\n'))

os.system('bash fix_authors.sh')
