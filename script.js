// Инициализация анимации появления блоков
function initScrollPresentation() {
    const rules = document.querySelectorAll('.rule');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.5
    });

    rules.forEach(rule => observer.observe(rule));
}

async function loadRules() {
    try {
        const response = await fetch('data.ezg');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        const container = document.getElementById('rules-container');

        for (let line of lines) {
            const [ruleFile, imageFile] = line.split('|');

            try {
                const ruleResponse = await fetch(`rules/${ruleFile}`);
                if (!ruleResponse.ok) continue;

                const ruleText = await ruleResponse.text();
                const block = createRuleBlock(ruleText, imageFile);
                container.appendChild(block);

            } catch {
                continue;
            }
        }

        initScrollPresentation(); // Инициализация анимации

    } catch (error) {
        console.error('Ошибка загрузки data.ezg');
    }
}

function createRuleBlock(text, imageFile) {
    const div = document.createElement('section');
    div.className = 'rule';

    const img = document.createElement('img');
    img.src = `img/${imageFile}`;

    const content = document.createElement('div');
    content.className = 'rule-content';

    const lines = text.split('\n').filter(l => l.trim() !== '');
    const title = document.createElement('h2');
    title.textContent = lines[0];

    const ul = document.createElement('ul');

    lines.slice(1).forEach(line => {
        if (line.trim().startsWith('+')) {
            const li = document.createElement('li');
            li.textContent = line.replace('+', '').replace(';','').trim();
            ul.appendChild(li);
        }
    });

    content.appendChild(title);
    content.appendChild(ul);

    div.appendChild(img);
    div.appendChild(content);

    return div;
}

loadRules();  // Запуск загрузки правил