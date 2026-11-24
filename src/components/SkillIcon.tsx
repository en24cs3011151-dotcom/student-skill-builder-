import {
  Award,
  BarChart3,
  Brain,
  CheckSquare,
  Clock,
  Code2,
  Compass,
  Cpu,
  Database,
  Flame,
  Footprints,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  MessageSquare,
  Palette,
  Sparkles,
  Target,
  Terminal,
} from 'lucide-react';
import { AchievementDefinition, SkillIconKey } from '../types';

export function SkillIcon({
  icon,
  className = 'h-5 w-5',
}: {
  icon: SkillIconKey;
  className?: string;
}) {
  switch (icon) {
    case 'globe':
      return <Globe className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'brain':
      return <Brain className={className} />;
    case 'bar-chart':
      return <BarChart3 className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'message':
      return <MessageSquare className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'layout':
      return <LayoutGrid className={className} />;
    case 'git-branch':
      return <GitBranch className={className} />;
    case 'code':
    default:
      return <Code2 className={className} />;
  }
}

export function AchievementIcon({
  icon,
  className = 'h-5 w-5',
}: {
  icon: AchievementDefinition['icon'];
  className?: string;
}) {
  switch (icon) {
    case 'footprints':
      return <Footprints className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'check-square':
      return <CheckSquare className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'layers':
    default:
      return <Layers className={className} />;
  }
}
