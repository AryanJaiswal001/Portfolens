import {useEffect,useState} from 'react';
import {Sun, Moon} from 'lucide-react';

export default function ThemeToggle(){
    const [isDark,setIsDark]=useState(false);

    //Initailise theme on mount
    useEffect(()=>{
        //LocalStorage check
        const savedTheme=localStorage.getItem('theme')
        const prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
        const shouldBeDark=savedTheme==='dark'||(!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark',shouldBeDark);
    },[]);

    //Toggle theme handler
    const toggleTheme=()=>{
        const newTheme=!isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark',newTheme);
        localStorage.setItem('theme',newTheme?'dark':'light')
    };

    return(
        <button
        onClick={toggleTheme}
        className="p-2.5 rounded-lg border-2 hover:scale-110 transition-transform"
        style={{
            borderColor:"var(--border-medium)",
            backgroundColor:"var(--bg-card)",
            color:"var(--text-primary)",
        }}
        aria-label="Toggle theme"
        >
            {isDark ?(<Sun className="w-5 h-5"/>):(<Moon className="w-5 h-5"/>)}
        </button>
    );
}