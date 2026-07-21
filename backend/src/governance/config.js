module.exports={
 caseType:'versioned_academy_media_release',initialState:'source_registered',
 states:['source_registered','rights_verified','timeline_edited','render_queued','rendered','quality_review','publication_approved','published','exported'],
 createRoles:['academy_editor','program_manager'],assessmentRoles:['academy_editor','media_reviewer','rights_reviewer','accessibility_reviewer'],auditRoles:['program_manager','rights_reviewer','auditor'],connectorRoles:['integration_operator','program_manager'],
 evidenceKinds:['source_manifest','rights_license','consent_receipt','asset_manifest','timeline_version','render_job_receipt','render_manifest','quality_report','accessibility_report','brand_moderation_report','approval_record','publish_receipt','export_manifest','usage_record'],
 requiredSignals:['sourceVersion','timelineVersion','assetVersion','renderVersion','rightsStatus','consentStatus','moderationStatus','accessibilityStatus','exportProfile','policyVersion'],
 professionalBoundary:'Generated or edited music and media are drafts; qualified rights, safeguarding, accessibility, brand, and program reviewers approve publication.',
 connectors:[{name:'media_provider',purpose:'queued render receipts only'},{name:'rights_library',purpose:'license/version receipts'},{name:'object_storage',purpose:'encrypted asset pointers'},{name:'cdn',purpose:'delivery receipts'},{name:'transcription_translation',purpose:'versioned caption/translation receipts'},{name:'publishing',purpose:'signed publish receipts'},{name:'usage_accounting',purpose:'metered usage receipts'}],
 transitions:[
  {from:'source_registered',action:'verify_rights',to:'rights_verified',roles:['rights_reviewer'],requiresEvidence:true},
  {from:'rights_verified',action:'lock_timeline',to:'timeline_edited',roles:['academy_editor'],requiresEvidence:true},
  {from:'timeline_edited',action:'queue_render',to:'render_queued',roles:['academy_editor'],requiresEvidence:true},
  {from:'render_queued',action:'record_render',to:'rendered',roles:['integration_operator'],requiresEvidence:true},
  {from:'rendered',action:'review_quality',to:'quality_review',roles:['media_reviewer','accessibility_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'quality_review',action:'approve_publication',to:'publication_approved',roles:['program_manager','rights_reviewer'],requiresEvidence:true,dualControl:true},
  {from:'publication_approved',action:'record_publish',to:'published',roles:['program_manager'],requiresEvidence:true,dualControl:true},
  {from:'publication_approved',action:'record_export',to:'exported',roles:['academy_editor'],requiresEvidence:true,dualControl:true}
 ],
 assess:x=>{const ready=x.rightsStatus==='verified'&&x.consentStatus==='verified'&&x.moderationStatus==='passed'&&x.accessibilityStatus==='passed'&&['audio_master','video_master','accessible_web'].includes(x.exportProfile);return{disposition:ready?'human_publication_review_required':'rights_quality_or_accessibility_hold',publishCommand:null,versions:{source:x.sourceVersion,timeline:x.timelineVersion,assets:x.assetVersion,render:x.renderVersion}};}
};
