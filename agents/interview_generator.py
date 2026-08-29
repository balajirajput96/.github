from typing import Dict, List, Optional
from utils.logger import setup_logger

logger = setup_logger(__name__)

QA_QUESTION_BANK = [
    {
        "category": "IPQA & Production Controls",
        "question": "What critical parameters do you verify during line clearance for tablet compression?",
        "model_answer": "Verify complete removal of previous batch materials, labels, and documentation. Check cleanliness of compression machine, punches/dies, hoppers, de-dusters, and metal detectors. Verify room environment (temp/RH), status tags, and calibrated weighing balances before signing off.",
        "keywords": ["Line Clearance", "Punches/Dies", "De-duster", "Metal Detector", "Status Tag"]
    },
    {
        "category": "Documentation & Compliance",
        "question": "Explain the ALCOA+ principles in the context of BMR/BPR review.",
        "model_answer": "ALCOA+ stands for Attributable (who did it), Legible (readable), Contemporaneous (recorded in real-time), Original (first recording), and Accurate (truthful). The '+' includes Complete, Consistent, Enduring, and Available. In BMR review, ensure all entries have timestamps, signatures, cross-outs with reasons, and no blank fields.",
        "keywords": ["ALCOA+", "Data Integrity", "BMR", "BPR", "Contemporaneous"]
    },
    {
        "category": "Quality Systems & Investigations",
        "question": "How do you conduct a root cause analysis for a tablet weight variation deviation?",
        "model_answer": "Use the 5-Why and Ishikawa (Fishbone) methodology across Man, Machine, Material, Method, and Milieu. Check blend flowability/granule size distribution (Material), feeder speed and punch tooling wear (Machine), operator technique/sampling frequency (Man), environmental humidity (Milieu), and SOP adherence (Method). Implement targeted corrective and preventive actions (CAPA).",
        "keywords": ["5-Why", "Fishbone", "CAPA", "Weight Variation", "Feeder Speed"]
    },
    {
        "category": "Laboratory & Quality Control",
        "question": "What is the difference between OOS (Out of Specification) and OOT (Out of Trend)?",
        "model_answer": "OOS refers to a test result that falls outside established acceptance criteria or specification limits defined in pharmacopeia or registration files. OOT refers to a result that remains within specification limits but shows atypical behavior or a statistical shift from historical batch trends. Both require formal investigation under ICH Q10.",
        "keywords": ["OOS", "OOT", "Specification Limits", "Trend Analysis", "ICH Q10"]
    }
]

class InterviewGenerator:
    """Generates pharmaceutical QA/IPQA interview questions, scenarios, and model responses."""

    def __init__(self):
        self.question_bank = QA_QUESTION_BANK

    def generate_interview_prep(self, role: str = "QA Officer", company: Optional[str] = None) -> Dict:
        """Generates a complete interview preparation guide tailored to the role and company."""
        logger.info(f"Generating interview prep guide for {role} at {company or 'Pharma Company'}")

        intro_tips = [
            f"Highlight your 2 years of practical IPQA experience in OSD tablet manufacturing.",
            "Emphasize your hands-on proficiency in BMR/BPR verification, line clearance, and cGMP compliance.",
            "Discuss real examples of deviation investigations where you used 5-Why/Fishbone analysis to solve problems."
        ]

        behavioral_questions = [
            {
                "question": "Tell me about a time you identified a documentation discrepancy on the shop floor.",
                "guidance": "Describe how you stopped the step, verified against SOP, consulted the QA supervisor, documented an incident note, and ensured data integrity without falsification."
            },
            {
                "question": "How do you handle production pressure when batch release is delayed due to QA checks?",
                "guidance": "Emphasize that patient safety and cGMP compliance are non-negotiable, while communicating transparently and expeditiously with production supervisors."
            }
        ]

        return {
            "role": role,
            "company": company or "Pharmaceutical Manufacturer",
            "preparation_tips": intro_tips,
            "technical_questions": self.question_bank,
            "behavioral_questions": behavioral_questions
        }
